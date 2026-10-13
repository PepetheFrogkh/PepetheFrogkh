import type { Locale } from '@/lib/i18n'
import { Tbd } from './Tbd'

/**
 * L'emplacement du configurateur de prix.
 *
 * Le cahier demande de reutiliser le configurateur du site actuel, pas d'en
 * ecrire un autre. Son code n'est pas dans ce depot : l'emplacement reste
 * donc visible, et le composant qui l'incarnera devra appeler
 * `track('configurator_start')` a la premiere interaction et
 * `track('price_shown')` quand il affiche une estimation, pour tenir la liste
 * d'evenements du cahier.
 */
export default function ConfiguratorSlot({ locale }: { locale: Locale }) {
  return (
    <div className="tbd-block" style={{ minHeight: 180 }}>
      <Tbd locale={locale} what={locale === 'fr' ? 'configurateur de prix' : 'price configurator'} />
    </div>
  )
}
