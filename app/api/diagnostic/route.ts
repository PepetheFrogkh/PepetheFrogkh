import { NextResponse } from 'next/server'

/**
 * L'envoi du formulaire de diagnostic.
 *
 * Le cahier decrit la suite : le contact et l'entreprise sont crees dans
 * HubSpot avec une note « Diagnostic demande », Arnaud recoit une
 * notification, le visiteur recoit un email de confirmation, puis le resume
 * part sous 48 heures ouvrees.
 *
 * Ce qui est fait ici : la validation, l'anti-spam, la creation du contact,
 * de l'entreprise, de leur association et de la note, puis l'appel du
 * webhook de notification. L'email de confirmation au visiteur est un
 * workflow HubSpot declenche par la note, pas du code : il se configure dans
 * HubSpot, et la liste de controle du cahier demande de tester la chaine de
 * bout en bout avant la mise en ligne.
 *
 * Variables attendues, documentees dans le README :
 *   HUBSPOT_TOKEN              jeton d'application privee HubSpot
 *   DIAGNOSTIC_NOTIFY_WEBHOOK  webhook qui previent arnaud@kuiperstudio.com
 */

const HUBSPOT = 'https://api.hubapi.com'
const NOTIFY_TO = 'arnaud@kuiperstudio.com'

/** Le formulaire doit avoir ete ouvert au moins ce temps la. */
const MIN_ELAPSED_MS = 3000

interface Payload {
  venue?: string
  city?: string
  type?: string
  maps?: string
  name?: string
  email?: string
  consent?: boolean
  locale?: string
  trap?: string
  elapsed?: number
}

function clean(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

async function hubspot(path: string, body: unknown, token: string) {
  const res = await fetch(`${HUBSPOT}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`HubSpot ${path} a repondu ${res.status}: ${detail.slice(0, 300)}`)
  }
  return (await res.json()) as { id: string }
}

export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'corps illisible' }, { status: 400 })
  }

  const venue = clean(payload.venue)
  const city = clean(payload.city)
  const type = clean(payload.type, 40)
  const maps = clean(payload.maps, 500)
  const name = clean(payload.name, 120)
  const email = clean(payload.email, 160)

  if (!venue || !city || !name || !email || payload.consent !== true) {
    return NextResponse.json({ error: 'champs obligatoires manquants' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'email invalide' }, { status: 422 })
  }

  // anti-spam invisible : le leurre rempli, ou un envoi trop rapide, est
  // accepte en silence et jete. Un robot n'apprend rien d'une erreur.
  const trapped = clean(payload.trap) !== '' || (payload.elapsed ?? 0) < MIN_ELAPSED_MS
  if (trapped) return NextResponse.json({ ok: true })

  const token = process.env.HUBSPOT_TOKEN
  if (!token) {
    // en developpement on ne perd rien en silence, on le dit
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[diagnostic] HUBSPOT_TOKEN absent, rien envoye :', { venue, city, email })
      return NextResponse.json({ ok: true, stored: false })
    }
    return NextResponse.json({ error: 'HubSpot non configure' }, { status: 503 })
  }

  try {
    const [firstname, ...restName] = name.split(/\s+/)

    const contact = await hubspot(
      '/crm/v3/objects/contacts',
      {
        properties: {
          email,
          firstname,
          lastname: restName.join(' '),
          company: venue,
          city,
          hs_language: payload.locale === 'fr' ? 'fr' : 'en',
        },
      },
      token,
    )

    const company = await hubspot(
      '/crm/v3/objects/companies',
      { properties: { name: venue, city, website: maps || undefined } },
      token,
    )

    // HubSpot attend l'identifiant du type d'association ; 279 est
    // « company to contact » sur l'association par defaut.
    await fetch(
      `${HUBSPOT}/crm/v4/objects/companies/${company.id}/associations/contacts/${contact.id}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 279 },
        ]),
      },
    )

    const note = await hubspot(
      '/crm/v3/objects/notes',
      {
        properties: {
          hs_note_body: [
            'Diagnostic demandé',
            `Établissement : ${venue}`,
            `Ville : ${city}`,
            `Type : ${type}`,
            maps ? `Google Maps : ${maps}` : 'Google Maps : non fourni',
            `Langue : ${payload.locale ?? 'fr'}`,
          ].join('\n'),
          hs_timestamp: new Date().toISOString(),
        },
      },
      token,
    )

    // 202 : « note to contact »
    await fetch(`${HUBSPOT}/crm/v4/objects/notes/${note.id}/associations/contacts/${contact.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]),
    })

    const hook = process.env.DIAGNOSTIC_NOTIFY_WEBHOOK
    if (hook) {
      await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: NOTIFY_TO,
          subject: `Diagnostic demandé · ${venue}, ${city}`,
          venue,
          city,
          type,
          maps,
          name,
          email,
          contactId: contact.id,
        }),
      }).catch((error) => {
        // la demande est deja dans HubSpot : une notification perdue ne doit
        // pas faire echouer l'envoi cote visiteur
        console.error('[diagnostic] notification impossible', error)
      })
    }

    return NextResponse.json({ ok: true, stored: true })
  } catch (error) {
    console.error('[diagnostic]', error)
    return NextResponse.json({ error: 'envoi impossible' }, { status: 502 })
  }
}
