import { DesignSystemProvider } from '@/lib/styles'
import { CardsGrid } from '@/components/showcase/cards-grid'
import type { DesignSystem } from '@/modules/create/preset'

/**
 * Virtual width the showcase renders at before being scaled down into a tile.
 * Wide enough to lay the cards out in two columns; the tile clips the overflow.
 */
const BASE_WIDTH = 720

/**
 * A live, scaled-down render of the landing-page showcase cards, themed to a
 * single preset via a *scoped* DesignSystemProvider (so many of these can sit
 * on one page, each in its own theme). Purely decorative — inert and
 * pointer-events-none so the parent tile owns the interaction.
 *
 * Note: scoped theming is client-only (it mirrors the live `:root` token
 * closure), so on first paint a tile shows the page's default theme and
 * re-themes on hydration.
 */
export function PresetThumbnail({
  designSystem,
  width,
}: {
  designSystem: DesignSystem
  width: number
}) {
  const scale = width / BASE_WIDTH
  return (
    <DesignSystemProvider
      scoped
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
    >
      {/* Canvas, themed by the scope so the cards sit on the preset's own bg. */}
      <div aria-hidden className="absolute inset-0 bg-bg" />
      <div
        inert
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 origin-top-left select-none"
        style={{ width: BASE_WIDTH, transform: `scale(${scale})` }}
      >
        <div className="p-4">
          <CardsGrid variant="preview" />
        </div>
      </div>
    </DesignSystemProvider>
  )
}
