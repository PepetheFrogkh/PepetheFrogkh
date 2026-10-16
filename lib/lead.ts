/**
 * L'adresse ou partent les trois formulaires.
 *
 * En production le site est un export statique : il n'y a pas de route Next,
 * c'est `public/api/lead.php` qui repond, et le .htaccess fait pointer
 * `/api/lead` dessus. En developpement il n'y a pas de PHP : l'envoi est
 * simule, et le detail s'affiche dans la console plutot que de partir dans le
 * vide.
 *
 * Les trois formulaires appelaient `fetch('/api/lead')` chacun de leur cote :
 * une adresse en dur a trois endroits finit par diverger, et celle-la a change.
 */

export const LEAD_URL = '/api/lead'

/** Vrai quand le site tourne sans l'endpoint PHP, donc en developpement. */
const SIMULE = process.env.NODE_ENV !== 'production'

/**
 * Envoie un formulaire, et dit si c'est parti.
 *
 * Le PHP repond toujours en JSON ; un statut hors 2xx est une erreur, et
 * l'appelant affiche son message. Une panne de HubSpot ou de Telegram n'en est
 * pas une : l'endpoint les traite comme non bloquantes, et le visiteur qui a
 * rempli un formulaire ne doit pas voir l'echec d'un service tiers.
 */
export async function sendLead(payload: Record<string, unknown>): Promise<void> {
  if (SIMULE) {
    // eslint-disable-next-line no-console
    console.info('[lead] en developpement, rien n est envoye :', payload)
    await new Promise((r) => setTimeout(r, 400))
    return
  }

  const res = await fetch(LEAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(String(res.status))
}
