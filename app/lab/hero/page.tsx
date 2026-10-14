import ScrollSequence from '@/components/sequence/ScrollSequence'

/**
 * La route de test de l'en-tete : la sequence cinematique.
 *
 * Elle sert a juger la piece seule, avec la sequence de test, avant que la
 * vraie animation 3D ne soit fournie et avant de l'integrer a l'accueil.
 */
export default function Page() {
  return (
    <>
      <ScrollSequence
        eyebrow="Laboratoire · en-tête"
        title={
          <>
            On construit les outils qui font <em>tourner</em> votre entreprise.
          </>
        }
        lead="Sites web, automatisations, applications métier : livrés vite, à prix affichés, par une équipe qui connaît votre métier."
      />

      {/* Un bloc apres l'en-tete, pour voir la section se desepingler. */}
      <section className="lab__after">
        <p className="lead">
          Fin de l&rsquo;en-tête. La suite de l&rsquo;accueil viendra ici.
        </p>
      </section>
    </>
  )
}
