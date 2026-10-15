import type { NextConfig } from 'next'

/**
 * Le site part en export statique.
 *
 * L'hebergement de production sert un dossier de fichiers, sans serveur Node :
 * un workflow construit `out/`, le pousse sur une branche `deploy`, et
 * l'hebergeur la sert depuis `public_html`. Trois consequences, et elles ne se
 * contournent pas :
 *
 * - pas de route serveur. Le formulaire poste sur `/api/lead`, servi par
 *   `public/api/lead.php`, que le .htaccess fait pointer sur l'adresse propre.
 * - pas de middleware. Le choix de la langue a l'arrivee et les redirections
 *   des anciennes adresses sont dans le .htaccess, engendre au build par
 *   `app/htaccess/route.ts` depuis les memes tables que les pages.
 * - pas d'optimiseur d'images. Les images sont deja en WebP, aux tailles
 *   servies : il n'y avait rien a optimiser a la volee.
 *
 * `trailingSlash` parce qu'un export sert `page/index.html` : sans la barre
 * finale, les adresses relatives d'une page partiraient d'un cran trop haut.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
