<?php
// ════════════════════════════════════════════════════════════════
// Notifications serveur : Telegram (alerte instantanée) + HubSpot (CRM).
// Portage PHP de l'ancien lib/notify.ts (API Next sur Vercel), même comportement.
// Tout est non bloquant : chaque fonction avale ses erreurs et ne lève jamais,
// de sorte qu'une intégration en panne ne casse jamais un envoi de formulaire.
//
// Les secrets ne sont PAS dans le dépôt. Ils vivent dans kuiper-secrets.php, un
// cran AU-DESSUS de public_html (jamais servi par le web), modèle dans
// deploy/kuiper-secrets.example.php. À défaut, variables d'environnement :
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, HUBSPOT_ACCESS_TOKEN,
//   HUBSPOT_PIPELINE (défaut "default"), HUBSPOT_DEALSTAGE (défaut "appointmentscheduled")
// Ce dossier est interdit d'accès direct par le .htaccess.
// ════════════════════════════════════════════════════════════════

declare(strict_types=1);

function kuiper_config(string $key, string $default = ''): string
{
    static $conf = null;
    if ($conf === null) {
        $conf = [];
        // Le dossier parent de public_html, qu'on y accède par le lien
        // ~/public_html ou par son vrai chemin ~/domains/<domaine>/public_html.
        $root = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
        $webroot = realpath(__DIR__ . '/../..') ?: '';
        $dirs = array_unique(array_filter([
            $root !== '' ? dirname($root) : '',
            $root !== '' && realpath($root) ? dirname(realpath($root)) : '',
            $webroot !== '' ? dirname($webroot) : '',
        ]));
        foreach ($dirs as $dir) {
            if (!is_file("$dir/kuiper-secrets.php")) continue;
            $loaded = require "$dir/kuiper-secrets.php";
            if (is_array($loaded)) $conf = $loaded;
            break;
        }
    }
    $v = $conf[$key] ?? getenv($key);
    return is_string($v) && $v !== '' ? $v : $default;
}

// ── Requête / réponse ─────────────────────────────────────────────

function kuiper_json(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Corps JSON d'un POST, ou null si absent / invalide.
function kuiper_read_json(): ?array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        kuiper_json(['ok' => false, 'error' => 'method'], 405);
    }
    $raw = file_get_contents('php://input', false, null, 0, 64 * 1024);
    $body = json_decode($raw ?: '', true);
    return is_array($body) ? $body : null;
}

// Valeur texte d'un champ du corps, nettoyée.
function kuiper_str(array $body, string $key): string
{
    $v = $body[$key] ?? '';
    return is_scalar($v) ? trim((string) $v) : '';
}

function kuiper_is_email(string $v): bool
{
    return (bool) preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $v);
}

// ── HTTP sortant ──────────────────────────────────────────────────

/** @return array{0:int,1:string} code HTTP (0 si échec réseau) et corps */
function kuiper_http(string $method, string $url, array $headers, ?array $json): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
    ]);
    if ($json !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json, JSON_UNESCAPED_UNICODE));
    $res = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    if ($res === false) error_log('[notify] ' . $url . ' ' . curl_error($ch));
    curl_close($ch);
    return [$code, is_string($res) ? $res : ''];
}

// ── Telegram ──────────────────────────────────────────────────────

// Échappe le texte pour le parse_mode MarkdownV2 de Telegram.
function tg_esc($v): string
{
    $s = ($v === null || $v === '') ? '—' : (string) $v;
    return preg_replace('/([_*\[\]()~`>#+\-=|{}.!\\\\])/u', '\\\\$1', $s);
}

// Template dynamique : un titre + des champs label/valeur. Les champs vides sont ignorés.
/** @param array<int,array{0:string,1:mixed}> $fields */
function tg_template(string $title, array $fields, string $footer = ''): string
{
    $lines = ['*' . tg_esc($title) . '*', ''];
    foreach ($fields as [$label, $value]) {
        if ($value === null || $value === '') continue;
        $lines[] = tg_esc($label) . ' : ' . tg_esc($value);
    }
    if ($footer !== '') {
        $lines[] = '';
        $lines[] = '_' . tg_esc($footer) . '_';
    }
    return implode("\n", $lines);
}

function send_telegram(string $text): bool
{
    $token = kuiper_config('TELEGRAM_BOT_TOKEN');
    $chat = kuiper_config('TELEGRAM_CHAT_ID');
    if ($token === '' || $chat === '') return false;
    [$code, $res] = kuiper_http('POST', "https://api.telegram.org/bot{$token}/sendMessage", [], [
        'chat_id' => $chat,
        'text' => $text,
        'parse_mode' => 'MarkdownV2',
        'disable_web_page_preview' => true,
    ]);
    if ($code < 200 || $code >= 300) error_log("[notify] telegram {$code} {$res}");
    return $code >= 200 && $code < 300;
}

// ── HubSpot ───────────────────────────────────────────────────────

const HUBSPOT_API = 'https://api.hubapi.com';

function hubspot_headers(string $token): array
{
    return ["Authorization: Bearer {$token}"];
}

// Crée ou met à jour un contact par email. Renvoie son id, ou null si échec / désactivé.
function hubspot_upsert_contact(array $input): ?string
{
    $token = kuiper_config('HUBSPOT_ACCESS_TOKEN');
    $email = (string) ($input['email'] ?? '');
    if ($token === '' || $email === '') return null;

    $props = ['email' => $email];
    foreach (['firstname', 'lastname', 'company', 'phone', 'message'] as $k) {
        if (!empty($input[$k])) $props[$k] = (string) $input[$k];
    }
    if (!empty($input['leadStatus'])) $props['hs_lead_status'] = (string) $input['leadStatus'];

    // 1) tentative de création
    [$code, $res] = kuiper_http('POST', HUBSPOT_API . '/crm/v3/objects/contacts', hubspot_headers($token), ['properties' => $props]);
    if ($code >= 200 && $code < 300) return json_decode($res, true)['id'] ?? null;

    // 2) contact déjà existant (409) : mise à jour par email
    if ($code === 409) {
        $url = HUBSPOT_API . '/crm/v3/objects/contacts/' . rawurlencode($email) . '?idProperty=email';
        [$code2, $res2] = kuiper_http('PATCH', $url, hubspot_headers($token), ['properties' => $props]);
        if ($code2 >= 200 && $code2 < 300) return json_decode($res2, true)['id'] ?? null;
        error_log("[notify] hubspot update {$code2} {$res2}");
        return null;
    }
    error_log("[notify] hubspot create {$code} {$res}");
    return null;
}

// Crée un deal, associé au contact si fourni. Non bloquant.
function hubspot_create_deal(array $input): ?string
{
    $token = kuiper_config('HUBSPOT_ACCESS_TOKEN');
    if ($token === '') return null;

    $props = [
        'dealname' => (string) $input['dealname'],
        'pipeline' => kuiper_config('HUBSPOT_PIPELINE', 'default'),
        'dealstage' => kuiper_config('HUBSPOT_DEALSTAGE', 'appointmentscheduled'),
    ];
    if (!empty($input['amount']) && $input['amount'] > 0) $props['amount'] = (string) round((float) $input['amount']);
    if (!empty($input['description'])) $props['description'] = (string) $input['description'];

    $body = ['properties' => $props];
    // association deal -> contact (type d'association HubSpot par défaut : 3)
    if (!empty($input['contactId'])) {
        $body['associations'] = [[
            'to' => ['id' => (string) $input['contactId']],
            'types' => [['associationCategory' => 'HUBSPOT_DEFINED', 'associationTypeId' => 3]],
        ]];
    }

    [$code, $res] = kuiper_http('POST', HUBSPOT_API . '/crm/v3/objects/deals', hubspot_headers($token), $body);
    if ($code >= 200 && $code < 300) return json_decode($res, true)['id'] ?? null;
    error_log("[notify] hubspot deal {$code} {$res}");
    return null;
}
