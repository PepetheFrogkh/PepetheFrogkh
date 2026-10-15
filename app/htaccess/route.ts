import { DEFAULT_LOCALE, LOCALES, PUBLISHED_LOCALES, SITE_URL, path } from '@/lib/i18n'

/**
 * Le .htaccess du site, engendre au build.
 *
 * L'hebergement sert un export statique : il n'execute pas Node, donc ni le
 * middleware ni les redirections de `next.config.ts` ne tournent. Ce qu'ils
 * faisaient se fait ici, dans un fichier que LiteSpeed lit comme Apache.
 *
 * Il est engendre depuis les memes tables que les pages, et non ecrit a la
 * main : un segment d'adresse qui change dans `lib/i18n` change ici au
 * prochain build, sans que personne ait a y penser.
 *
 * `scripts/finalize-export.mjs` le renomme ensuite `out/htaccess` en
 * `out/.htaccess` : Next ne sait pas ecrire un fichier dont le nom commence
 * par un point.
 */
export const dynamic = 'force-static'

/**
 * Les anciennes adresses.
 *
 * Le plan du site a change : les situations deviennent les expertises, la
 * methode passe dans l'accueil, le diagnostic devient le contact. Elles ont pu
 * etre partagees, indexees, mises en favori : elles repondent donc en 301 vers
 * la page qui les remplace plutot qu'en 404.
 *
 * Les pages situation ne sont pas redirigees une par une vers une expertise :
 * la correspondance serait devinee. Elles renvoient toutes vers la liste, ou le
 * visiteur choisit lui-meme.
 */
const LEGACY: { from: string; to: string }[] = [
  { from: '^fr/situations(/.*)?$', to: '/fr/expertises/' },
  { from: '^en/situations(/.*)?$', to: '/en/expertise/' },
  { from: '^fr/methode/?$', to: '/fr/' },
  { from: '^en/method/?$', to: '/en/' },
  { from: '^fr/diagnostic/?$', to: '/fr/contact/' },
  { from: '^en/diagnostic/?$', to: '/en/contact/' },
]

function build(): string {
  const langs = LOCALES.join('|')
  const lignes: string[] = [
    '# Engendre par app/htaccess/route.ts. Ne pas modifier a la main :',
    '# le prochain build l ecrase. Les regles viennent des tables de lib/i18n.',
    '',
    'Options -MultiViews',
    'DirectoryIndex index.html',
    '',
    '<IfModule mod_rewrite.c>',
    'RewriteEngine On',
    '',
    '# ── l API, en PHP ───────────────────────────────────────────────────',
    '# Le formulaire poste sur /api/lead ; le fichier servi est lead.php.',
    'RewriteRule ^api/lead/?$ /api/lead.php [L]',
    '',
    '# ── les anciennes adresses ──────────────────────────────────────────',
    ...LEGACY.map((r) => `RewriteRule ${r.from} ${SITE_URL}${r.to} [R=301,L]`),
    '',
    '# ── la langue d arrivee ─────────────────────────────────────────────',
    '# La racine renvoie vers la langue du navigateur, parmi celles que le site',
    '# publie, et vers l anglais sinon. C est ce que faisait le middleware.',
    ...PUBLISHED_LOCALES.filter((l) => l !== DEFAULT_LOCALE).map(
      (l) =>
        `RewriteCond %{HTTP:Accept-Language} ^${l}([-;,]|$) [NC]\nRewriteRule ^$ ${SITE_URL}${path(l, 'home')}/ [R=302,L]`,
    ),
    `RewriteRule ^$ ${SITE_URL}${path(DEFAULT_LOCALE, 'home')}/ [R=302,L]`,
    '',
    '# Une adresse sans prefixe de langue prend la langue par defaut.',
    `RewriteCond %{REQUEST_URI} !^/(${langs})(/|$)`,
    'RewriteCond %{REQUEST_URI} !^/(api|_next|images|sequence|tools|stack|people|clients|work|icons)(/|$)',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteCond %{REQUEST_FILENAME} !-d',
    `RewriteRule ^(.*)$ ${SITE_URL}${path(DEFAULT_LOCALE, 'home')}/$1 [R=301,L]`,
    '</IfModule>',
    '',
    '# ── le cache ────────────────────────────────────────────────────────',
    '# Les images de la sequence et les logos ne changent jamais sans changer',
    '# de nom : un an. Le HTML, lui, doit pouvoir changer le jour meme.',
    '<IfModule mod_expires.c>',
    'ExpiresActive On',
    'ExpiresByType image/webp "access plus 1 year"',
    'ExpiresByType image/svg+xml "access plus 1 year"',
    'ExpiresByType font/woff2 "access plus 1 year"',
    'ExpiresByType text/html "access plus 0 seconds"',
    '</IfModule>',
    '',
    '# ── les pages d erreur ──────────────────────────────────────────────',
    `ErrorDocument 404 ${path(DEFAULT_LOCALE, 'home')}/404.html`,
    '',
  ]
  return lignes.join('\n')
}

export function GET(): Response {
  return new Response(build(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
