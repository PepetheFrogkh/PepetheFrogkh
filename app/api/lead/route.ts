import { NextResponse } from 'next/server'

/**
 * L'arrivee d'un contact, d'une estimation de site ou d'une estimation
 * d'automatisation.
 *
 * Les trois formulaires du site passent par ici : le contact, le
 * configurateur de sites et le simulateur d'automatisation. Ils different par
 * ce qu'ils racontent, pas par ce qu'ils creent : un contact HubSpot, une
 * entreprise quand elle est connue, leur association, et une note qui porte le
 * detail. Un seul endroit a configurer, un seul a tester.
 *
 * Variables attendues, documentees dans le README :
 *   HUBSPOT_TOKEN         jeton d'application privee HubSpot
 *   LEAD_NOTIFY_WEBHOOK   webhook qui previent arnaud@kuiperstudio.com
 */

const HUBSPOT = 'https://api.hubapi.com'
const NOTIFY_TO = 'arnaud@kuiperstudio.com'

/** Le formulaire doit avoir ete ouvert au moins ce temps la. */
const MIN_ELAPSED_MS = 3000

type Kind = 'contact' | 'configurator' | 'simulator'

interface Payload {
  kind?: Kind
  company?: string
  city?: string
  need?: string
  message?: string
  name?: string
  email?: string
  consent?: boolean
  locale?: string
  /** Le detail de l'estimation, tel que le composant l'a calcule. */
  estimate?: unknown
  trap?: string
  elapsed?: number
}

/** L'intitule de la note, par type de formulaire. */
const TITLE: Record<Kind, string> = {
  contact: 'Demande de contact',
  configurator: 'Estimation de site',
  simulator: 'Estimation d’automatisation',
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

  const kind: Kind =
    payload.kind === 'configurator' || payload.kind === 'simulator' ? payload.kind : 'contact'
  const company = clean(payload.company)
  const city = clean(payload.city)
  const need = clean(payload.need, 80)
  const message = clean(payload.message, 2000)
  const name = clean(payload.name, 120)
  const email = clean(payload.email, 160)

  // L'email et le consentement sont toujours requis. Le nom et l'entreprise ne
  // le sont que pour le contact : une estimation ne demande que l'email, et
  // c'est ce que promet le cahier.
  if (!email || payload.consent !== true) {
    return NextResponse.json({ error: 'champs obligatoires manquants' }, { status: 422 })
  }
  if (kind === 'contact' && (!company || !name)) {
    return NextResponse.json({ error: 'champs obligatoires manquants' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'email invalide' }, { status: 422 })
  }

  // anti-spam invisible : le leurre rempli, ou un envoi trop rapide, est
  // accepte en silence et jete. Un robot n'apprend rien d'une erreur.
  const trapped = clean(payload.trap) !== '' || (payload.elapsed ?? 0) < MIN_ELAPSED_MS
  if (trapped) return NextResponse.json({ ok: true })

  /** Le corps de la note : ce que le formulaire a dit, et rien de plus. */
  const lines = [
    TITLE[kind],
    company ? `Entreprise : ${company}` : null,
    city ? `Ville : ${city}` : null,
    need ? `Besoin : ${need}` : null,
    `Langue : ${payload.locale ?? 'fr'}`,
    message ? `Message :\n${message}` : null,
    payload.estimate ? `Estimation :\n${JSON.stringify(payload.estimate, null, 2)}` : null,
  ].filter(Boolean) as string[]

  const token = process.env.HUBSPOT_TOKEN
  if (!token) {
    // en developpement on ne perd rien en silence, on le dit
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[lead] HUBSPOT_TOKEN absent, rien envoye :', { kind, email, company })
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
          firstname: firstname || undefined,
          lastname: restName.join(' ') || undefined,
          company: company || undefined,
          city: city || undefined,
          hs_language: payload.locale === 'fr' ? 'fr' : 'en',
        },
      },
      token,
    )

    if (company) {
      const org = await hubspot(
        '/crm/v3/objects/companies',
        { properties: { name: company, city: city || undefined } },
        token,
      )
      // HubSpot attend l'identifiant du type d'association ; 279 est
      // « company to contact » sur l'association par defaut.
      await fetch(
        `${HUBSPOT}/crm/v4/objects/companies/${org.id}/associations/contacts/${contact.id}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([
            { associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 279 },
          ]),
        },
      )
    }

    const note = await hubspot(
      '/crm/v3/objects/notes',
      {
        properties: {
          hs_note_body: lines.join('\n'),
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

    const hook = process.env.LEAD_NOTIFY_WEBHOOK
    if (hook) {
      await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: NOTIFY_TO,
          subject: `${TITLE[kind]}${company ? ` · ${company}` : ''}`,
          kind,
          company,
          city,
          need,
          name,
          email,
          contactId: contact.id,
          body: lines.join('\n'),
        }),
      })
    }

    return NextResponse.json({ ok: true, stored: true })
  } catch (error) {
    console.error('[lead]', error)
    return NextResponse.json({ error: 'envoi impossible' }, { status: 502 })
  }
}
