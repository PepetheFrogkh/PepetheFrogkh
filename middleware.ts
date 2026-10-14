import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'

/**
 * La langue d'arrivee.
 *
 * Le cahier : francais si le navigateur est en francais, anglais sinon. Le
 * choix n'est qu'une redirection de la racine ; les deux langues gardent
 * leurs propres adresses, et le selecteur de l'en-tete reste maitre ensuite.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next()
  }

  const header = request.headers.get('accept-language') ?? ''
  const french = header
    .split(',')
    .some((part) => part.trim().toLowerCase().startsWith('fr'))

  const url = request.nextUrl.clone()
  url.pathname = `/${french ? 'fr' : DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|lab|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}
