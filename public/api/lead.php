<?php
// L'arrivée d'un contact, d'une estimation de site ou d'une estimation
// d'automatisation (POST /api/lead).
//
// Les trois formulaires du site passent par ici : le contact, le configurateur
// de sites et le simulateur d'automatisation. Ils diffèrent par ce qu'ils
// racontent, pas par ce qu'ils créent : un contact HubSpot, une note qui porte
// le détail, et une alerte Telegram. Un seul endroit à configurer, un seul à
// tester.
//
// C'est la version PHP de ce qui était une route Next (`app/api/lead/route.ts`).
// L'hébergement Hostinger sert un export statique : il n'exécute pas Node, donc
// une route Next n'y répond pas. PHP, lui, tourne, et les secrets vivent un
// cran au-dessus de public_html, voir `deploy/kuiper-secrets.example.php`.
//
// Les intégrations sont non bloquantes : une panne de l'une ne fait pas échouer
// l'envoi, parce qu'un visiteur qui a rempli un formulaire ne doit jamais voir
// une erreur due à un service tiers.
declare(strict_types=1);
require __DIR__ . '/lib/notify.php';

// Le formulaire doit avoir été ouvert au moins ce temps-là : un robot remplit
// plus vite qu'un humain ne lit.
const MIN_ELAPSED_MS = 3000;

const TITLES = [
    'contact'      => 'Demande de contact',
    'configurator' => 'Estimation de site',
    'simulator'    => "Estimation d'automatisation",
];

$body = kuiper_read_json();
if ($body === null) kuiper_json(['error' => 'corps illisible'], 400);

$kind = kuiper_str($body, 'kind');
if (!isset(TITLES[$kind])) $kind = 'contact';

$company = kuiper_str($body, 'company');
$city    = kuiper_str($body, 'city');
$need    = kuiper_str($body, 'need');
$message = kuiper_str($body, 'message');
$name    = kuiper_str($body, 'name');
$email   = kuiper_str($body, 'email');
$locale  = kuiper_str($body, 'locale') === 'en' ? 'en' : 'fr';
$consent = ($body['consent'] ?? false) === true;

// L'email et le consentement sont toujours requis. Le nom et l'entreprise ne le
// sont que pour le contact : une estimation ne demande que l'email, et c'est ce
// que la page promet.
if ($email === '' || !$consent || !kuiper_is_email($email)) {
    kuiper_json(['error' => 'champs obligatoires manquants'], 422);
}
if ($kind === 'contact' && ($company === '' || $name === '')) {
    kuiper_json(['error' => 'champs obligatoires manquants'], 422);
}

// Anti-spam invisible : le leurre rempli, ou un envoi trop rapide, est accepté
// en silence et jeté. Un robot n'apprend rien d'une erreur.
$elapsed = (int) ($body['elapsed'] ?? 0);
if (kuiper_str($body, 'trap') !== '' || $elapsed < MIN_ELAPSED_MS) {
    kuiper_json(['ok' => true]);
}

// Le détail de l'estimation, tel que le composant l'a calculé. Il est réaffiché
// tel quel : c'est une trace, pas une donnée à interpréter côté serveur.
$estimate = $body['estimate'] ?? null;
$detail = $estimate === null
    ? ''
    : json_encode($estimate, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$fields = array_values(array_filter([
    $name !== ''    ? ['Nom', $name] : null,
    ['Email', $email],
    $company !== '' ? ['Entreprise', $company] : null,
    $city !== ''    ? ['Ville', $city] : null,
    $need !== ''    ? ['Besoin', $need] : null,
    ['Langue', strtoupper($locale)],
]));

$at = gmdate('c');

// 1) Telegram : l'alerte instantanée, avec le détail s'il y en a un.
$texte = tg_template('✉️ ' . TITLES[$kind], $fields, $at);
if ($message !== '') $texte .= "\n\n" . tg_esc($message);
if ($detail !== '')  $texte .= "\n\n<pre>" . tg_esc($detail) . '</pre>';
send_telegram($texte);

// 2) HubSpot : le contact, puis la note qui porte le détail.
$parts = preg_split('/\s+/', $name) ?: [$name];
$note = TITLES[$kind]
    . ($company !== '' ? " · Entreprise {$company}" : '')
    . ($city !== '' ? " · Ville {$city}" : '')
    . ($need !== '' ? " · Besoin {$need}" : '')
    . ($message !== '' ? "\n\n{$message}" : '')
    . ($detail !== '' ? "\n\n{$detail}" : '');

$contactId = hubspot_upsert_contact([
    'email'     => $email,
    'firstname' => $parts[0] ?? '',
    'lastname'  => count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '',
    'company'   => $company,
    'city'      => $city,
    'language'  => $locale,
    'note'      => $note,
]);

kuiper_json(['ok' => true, 'contact' => $contactId !== null]);
