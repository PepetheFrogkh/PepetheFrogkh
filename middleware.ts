import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'
import {
  COUNTRY_HEADERS,
  CURRENCY_COOKIE,
  CURRENCY_MAX_AGE,
  currencyFor,
} from '@/lib/currency'

/**
 * La langue d'arrivee et la devise d'arrivee.
 *
 * La langue : francais si le navigateur est en francais, anglais sinon. Le
 * choix n'est qu'une redirection de la racine ; les deux langues gardent leurs
 * propres adresses, et le selecteur de l'en-tete reste maitre ensuite.
 *
 * La devise : euros pour l'Europe, dollars ailleurs, d'apres l'en-tete de pays
 * pose par le proxy. Le resultat part dans un cookie, que les pages lisent
 * sans devenir dynamiques. Un cookie deja la n'est jamais reecrit : un choix
 * explicite du visiteur prime sur la detection.
 */

/** Le pays du visiteur, si un proxy l'a mis dans les en-tetes. */
function country(request: NextRequest): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = request.headers.get(name)
    // Cloudflare renvoie XX quand il ne sait pas, et T1 derriere Tor
    if (value && value !== 'XX' && value !== 'T1') return value
  }
  return null
}

function withCurrency(response: NextResponse, request: NextRequest): NextResponse {
  if (request.cookies.has(CURRENCY_COOKIE)) return response
  const code = country(request)
  // sans en-tete de pays, on ne pose rien : le repli sur le fuseau horaire du
  // navigateur s'en charge, avant le premier affichage
  if (!code) return response
  response.cookies.set(CURRENCY_COOKIE, currencyFor(code), {
    path: '/',
    maxAge: CURRENCY_MAX_AGE,
    sameSite: 'lax',
  })
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return withCurrency(NextResponse.next(), request)
  }

  const header = request.headers.get('accept-language') ?? ''
  const french = header
    .split(',')
    .some((part) => part.trim().toLowerCase().startsWith('fr'))

  const url = request.nextUrl.clone()
  url.pathname = `/${french ? 'fr' : DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return withCurrency(NextResponse.redirect(url), request)
}

export const config = {
  matcher: ['/((?!api|lab|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}
