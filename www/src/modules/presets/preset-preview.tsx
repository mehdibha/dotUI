'use client'

import { lazy, Suspense } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { Loader } from '@/registry/ui/loader'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import type { DesignSystem } from '@/modules/create/preset'

import { PresetAppScene } from './preset-app-scene'

/**
 * What the previewed system is rendered on. Everything but the app screen is
 * lazy: the picker ships with the cheap default, and the heavier screens only
 * reach the bundle once someone asks for them.
 */
const StyleGuideScene = lazy(() =>
  import('@/modules/create/preview/overview').then((m) => ({
    default: m.PresetOverview,
  })),
)
const CardsScene = lazy(
  () => import('@/modules/create/preview/group-examples/cards'),
)

const SCENES = [
  { id: 'app', label: 'App' },
  { id: 'style-guide', label: 'Style guide' },
  { id: 'cards', label: 'Cards' },
] as const

type PreviewSceneId = (typeof SCENES)[number]['id']

/**
 * The picker's right pane: one design system rendered on a real screen, chosen
 * from a few scenes — the same idea as the /create preview, minus its iframe.
 *
 * The iframe there buys device widths, zoom and fullscreen; here it would cost
 * a document load every time the picker opens and a postMessage round trip per
 * hovered row. Scoped theming already isolates the tokens, so the scenes render
 * inline and switching systems is a stylesheet swap on a tree that stays
 * mounted — which is what keeps walking the rail instant.
 *
 * The toolbar deliberately sits OUTSIDE the scope: it's picker chrome, and it
 * would be unreadable if it re-themed with every row you pass over.
 */
export function PresetPreview({
  name,
  designSystem,
  forcedMode,
  scene,
  onSceneChange,
}: {
  name: string
  designSystem: DesignSystem
  forcedMode?: 'light' | 'dark'
  scene: PreviewSceneId
  onSceneChange: (scene: PreviewSceneId) => void
}) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
        <span className="min-w-0 truncate text-sm font-medium">{name}</span>
        {/* A segmented control, not a select: the whole point is switching
            scenes in one press, and an overlay inside the modal would fight the
            modal's own dismiss handling. */}
        <SegmentedControl
          aria-label="Preview scene"
          selectedKeys={[scene]}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            if (next) onSceneChange(next as PreviewSceneId)
          }}
          className="shrink-0"
        >
          {SCENES.map((option) => (
            <SegmentedControlItem key={option.id} id={option.id}>
              {option.label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>

      <DesignSystemProvider
        scoped
        params={designSystem.componentParams}
        tokens={designSystem.tokens}
        density={designSystem.density}
        color={designSystem.color}
        icons={designSystem.icons}
        forcedMode={forcedMode}
      >
        {/* Scrolling lives on this wrapper and inertness on the child: the rail
            owns the interaction, so nothing in the scene takes focus or reaches
            the accessibility tree, but the wheel still finds a live scroll
            container (an inert box isn't hit-testable, so scrolling it directly
            would fall through to the page behind the modal). */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-bg text-fg">
          <div
            inert
            aria-hidden
            className="flex min-h-full flex-col select-none"
          >
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center">
                  <Loader />
                </div>
              }
            >
              {scene === 'app' && <PresetAppScene />}
              {scene === 'style-guide' && (
                <StyleGuideScene designSystem={designSystem} />
              )}
              {scene === 'cards' && <CardsScene />}
            </Suspense>
          </div>
        </div>
      </DesignSystemProvider>
    </div>
  )
}

export type { PreviewSceneId }
