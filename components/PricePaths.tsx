'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { track } from '@/lib/analytics'
import type { ServiceKey } from '@/lib/i18n'

/**
 * Le chemin de prix, choisi par le visiteur.
 *
 * La page Tarifs deversait huit tableaux et trente et une lignes sous un seul
 * intertitre, dans un ordre qui ne disait rien, precedes du canevas
 * d'automatisation : quelqu'un qui vient pour un site web tombait sur un
 * simulateur de flux, puis devait chercher ses prix dans la masse.
 *
 * Elle commence maintenant par la seule question qui compte, « que voulez-vous
 * construire », et ne montre que la reponse : l'estimateur du chemin choisi,
 * puis le detail de ses prix, et rien d'autre.
 *
 * Les six panneaux sont dans le HTML, rendus par le serveur et passes ici en
 * `ReactNode` : les prix restent lisibles par un moteur de recherche et par
 * qui n'a pas de JavaScript, qui les voit tous les six a la suite. Seul leur
 * affichage se choisit, et le choix tient dans l'adresse, donc un lien vers
 * `#automations` ouvre le bon chemin.
 */
export default function PricePaths({
  question,
  options,
  panels,
  initial,
}: {
  question: string
  options: { key: ServiceKey; name: string; desc: string }[]
  panels: Record<string, ReactNode>
  initial: ServiceKey
}) {
  const [pick, setPick] = useState<ServiceKey>(initial)
  /**
   * Faux tant que la page n'a pas repris la main.
   *
   * Avant, les six panneaux sont visibles : c'est ce que voit un moteur de
   * recherche, et c'est ce que voit un visiteur sans JavaScript. Les cacher
   * des le rendu serveur reviendrait a cacher les prix.
   */
  const [live, setLive] = useState(false)

  useEffect(() => {
    setLive(true)
    const fromHash = window.location.hash.replace('#', '')
    if (options.some((o) => o.key === fromHash)) setPick(fromHash as ServiceKey)
  }, [options])

  const choose = (key: ServiceKey) => {
    setPick(key)
    // L'adresse suit le choix, sans ajouter d'entree a l'historique : le
    // bouton Retour doit ramener a la page precedente, pas au panneau
    // precedent.
    history.replaceState(null, '', `#${key}`)
    track('price_shown')
  }

  return (
    <div className="paths" data-live={live || undefined}>
      <div className="section__head">
        <h2 className="paths__q">{question}</h2>
      </div>

      <div className="paths__pick" role="tablist" aria-label={question}>
        {options.map((option) => (
          <button
            className="pathcard"
            type="button"
            key={option.key}
            role="tab"
            id={`path-${option.key}`}
            aria-selected={live ? pick === option.key : undefined}
            aria-controls={`panel-${option.key}`}
            onClick={() => choose(option.key)}
          >
            <span className="pathcard__name">{option.name}</span>
            <span className="pathcard__desc">{option.desc}</span>
          </button>
        ))}
      </div>

      {options.map((option) => (
        <div
          className="paths__panel"
          key={option.key}
          id={`panel-${option.key}`}
          role="tabpanel"
          aria-labelledby={`path-${option.key}`}
          hidden={live && pick !== option.key}
        >
          {panels[option.key]}
        </div>
      ))}
    </div>
  )
}
