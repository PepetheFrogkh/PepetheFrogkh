import { CURRENCY_COOKIE, CURRENCY_MAX_AGE, DEFAULT_CURRENCY } from '@/lib/currency'

/**
 * Le script qui pose la devise avant le premier affichage.
 *
 * Les pages portent les deux devises ; cet attribut decide laquelle se voit.
 * Il est pose avant que la page ne s'affiche, donc le prix ne clignote jamais.
 *
 * Trois sources, dans l'ordre. Le cookie, pose soit par le choix du visiteur,
 * soit par le middleware a partir de l'en-tete de pays du proxy. A defaut, le
 * fuseau horaire du navigateur, qui est le seul indice disponible quand
 * l'hebergeur ne pose aucun en-tete de pays. A defaut encore, l'euro.
 *
 * Sans JavaScript l'attribut n'existe pas, et la feuille de style montre
 * l'euro : la page reste lisible et le selecteur reste la.
 */
export default function CurrencyScript() {
  const code = `(function(){try{
var m=document.cookie.match(/(?:^|; )${CURRENCY_COOKIE}=(EUR|USD)/),c=m&&m[1];
if(!c){var z='';try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
c=/^(Europe\\/|Atlantic\\/(Canary|Madeira|Faroe|Reykjavik))/.test(z)?'EUR':'${DEFAULT_CURRENCY === 'EUR' ? 'USD' : 'EUR'}';
document.cookie='${CURRENCY_COOKIE}='+c+';path=/;max-age=${CURRENCY_MAX_AGE};samesite=lax'}
document.documentElement.setAttribute('data-currency',c)}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
