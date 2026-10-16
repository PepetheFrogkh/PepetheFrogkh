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

  // Les adresses de la version precedente du site, indexees par les moteurs et
  // partagees : elles existaient encore ce matin, elles ne doivent pas tomber
  // en 404. Chaque variante de langue est reprise, l'ancien site servant les
  // deux slugs sous chaque langue.
  { from: '^fr/(?:sites-web|websites)/?$', to: '/fr/tarifs/' },
  { from: '^en/(?:websites|sites-web)/?$', to: '/en/pricing/' },
  { from: '^fr/(?:estimer|estimate)/?$', to: '/fr/tarifs/' },
  { from: '^en/(?:estimate|estimer)/?$', to: '/en/pricing/' },
  // Le portefeuille devient les realisations, et garde le slug de chaque cas.
  { from: '^fr/portfolio/([a-z0-9-]+)/?$', to: '/fr/realisations/$1/' },
  { from: '^en/portfolio/([a-z0-9-]+)/?$', to: '/en/work/$1/' },
  { from: '^fr/portfolio/?$', to: '/fr/realisations/' },
  { from: '^en/portfolio/?$', to: '/en/work/' },
]

function build(): string {
  const langs = LOCALES.join('|')
  const lignes: string[] = [
    '# Engendre par app/htaccess/route.ts. Ne pas modifier a la main :',
    '# le prochain build l ecrase. Les regles viennent des tables de lib/i18n.',
    '',
    'Options -MultiViews -Indexes',
    'DirectoryIndex index.html',
    '',
    '<IfModule mod_rewrite.c>',
    'RewriteEngine On',
    '',
    '# ── le domaine nu vers www ──────────────────────────────────────────',
    '# L origine canonique porte le www : le domaine nu y est renvoye, sinon le',
    '# site repondrait sur deux adresses et le referencement se diluerait.',
    `RewriteCond %{HTTP_HOST} ^${new URL(SITE_URL).host.replace(/^www\./, '').replace(/\./g, '\\.')}$ [NC]`,
    `RewriteRule ^ ${SITE_URL}%{REQUEST_URI} [R=301,L]`,
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
    '# Les fichiers de _next/static portent un nom versionne : leur contenu ne',
    '# change jamais sans que leur nom change. Un an, et sans revalidation.',
    '<IfModule mod_headers.c>',
    '  <FilesMatch "\\.(js|css|woff2)$">',
    '    Header set Cache-Control "public, max-age=31536000, immutable"',
    '  </FilesMatch>',
    '  # Le HTML est toujours revalide : un deploiement est visible tout de suite.',
    '  <FilesMatch "\\.(html|txt|xml)$">',
    '    Header set Cache-Control "public, max-age=0, must-revalidate"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# ── la securite ─────────────────────────────────────────────────────',
    '# Ces en-tetes etaient deja servis par la production : les retirer serait',
    '# une regression. HSTS en particulier : un navigateur qui a vu cet en-tete',
    '# refuse ensuite le http pendant un an.',
    '<IfModule mod_headers.c>',
    '  Header always set X-Content-Type-Options "nosniff"',
    '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"',
    '  Header always set X-Frame-Options "SAMEORIGIN"',
    `  Header always set Content-Security-Policy "frame-ancestors 'self'; upgrade-insecure-requests"`,
    '  # Aucune API materielle n est utilisee : on les ferme toutes.',
    '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"',
    '  # Images et icones : reutilisables ailleurs (apercus de liens, logo dans un e-mail).',
    '  <FilesMatch "\\.(png|jpe?g|webp|avif|svg|ico)$">',
    '    Header always set Cross-Origin-Resource-Policy "cross-origin"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# Le depot git du deploiement et les fichiers internes ne sont jamais servis.',
    'RewriteEngine On',
    'RewriteRule (^|/)\\.(git|ht) - [F,L]',
    'RewriteRule ^api/lib/ - [F,L]',
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
