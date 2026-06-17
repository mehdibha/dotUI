'use client'

import { useMemo, useState } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { useMounted } from '@/hooks/use-mounted'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { Density } from '@/registry/types'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'
import { ShowcaseCustomizer } from '@/components/showcase/showcase-customizer'
import { encodePreset } from '@/modules/create/preset'

import { ChartCard } from './chart-card'
import { CHART_FAMILIES, variantsFor } from './data'

// Theme contract: every `--radius-*` token is `calc(<rem> * var(--radius-factor))`,
// so scaling this one global var rounds (or sharpens) every card at once.
const RADIUS_FACTOR_VAR = '--radius-factor'
const DEFAULT_ACCENT = DEFAULT_COLOR_CONFIG.seeds.accent
const DEFAULT_RADIUS = 1
const DEFAULT_DENSITY: Density = 'default'

/**
 * The charts showcase: a miniature design-system editor — the same
 * {@link ShowcaseCustomizer} the landing page uses — sits above a tabbed grid of
 * every shipped variant. Its accent / radius / density controls drive a
 * `DesignSystem` scoped (via the provider's `scoped` prop) to the grid alone, so
 * the charts re-theme live (`--chart-1` follows the accent, card corners follow
 * the radius) while the toolbar and the rest of the page stay put. "Open in
 * editor" deep-links into `/create` pre-seeded with the current tweaks, where the
 * full categorical chart palette can be edited.
 */
export function ChartShowcase() {
  const mounted = useMounted()
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [density, setDensity] = useState<Density>(DEFAULT_DENSITY)
  const [family, setFamily] = useState<string>(CHART_FAMILIES[0].id)

  const isDirty =
    accent !== DEFAULT_ACCENT ||
    radius !== DEFAULT_RADIUS ||
    density !== DEFAULT_DENSITY

  // Only diverge from the baked defaults once something actually changes: an
  // untouched preview emits no tokens and no color, rendering the exact default
  // theme (no redundant ramp regeneration, no `:root` writes).
  const tokens = useMemo(() => {
    const next: Record<string, string> = {}
    if (radius !== DEFAULT_RADIUS) next[RADIUS_FACTOR_VAR] = String(radius)
    return next
  }, [radius])
  const color = useMemo(
    () =>
      accent !== DEFAULT_ACCENT
        ? {
            ...DEFAULT_COLOR_CONFIG,
            seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent },
          }
        : undefined,
    [accent],
  )

  // Deep-link the "Open in editor" CTA into /create pre-seeded with the current
  // tweaks (encodePreset returns undefined when nothing diverges).
  const editorHref = useMemo(() => {
    if (!isDirty) return '/create'
    const preset = encodePreset({ componentParams: {}, tokens, density, color })
    return preset ? `/create?preset=${preset}` : '/create'
  }, [isDirty, tokens, density, color])

  // The tabbed grid. Each TabPanel shows every variant of one family at once;
  // React Aria only mounts the selected panel, so a single family's charts are
  // live at a time. Controlled `selectedKey` keeps the active tab across the
  // mount gate below.
  const tabs = (
    <Tabs
      selectedKey={family}
      onSelectionChange={(key) => setFamily(String(key))}
      className="gap-6"
    >
      <TabList aria-label="Chart families" className="flex-wrap">
        {CHART_FAMILIES.map((f) => (
          <Tab key={f.id} id={f.id}>
            {f.name} chart
          </Tab>
        ))}
      </TabList>
      {CHART_FAMILIES.map((f) => {
        const variants = variantsFor(f.id)
        return (
          <TabPanel key={f.id} id={f.id} className="flex flex-col gap-5">
            <p className="text-sm text-fg-muted">
              {f.tagline} {variants.length} variants.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {variants.map((v) => (
                <ChartCard
                  key={v.key}
                  familyId={f.id}
                  demoKey={v.key}
                  label={v.label}
                />
              ))}
            </div>
          </TabPanel>
        )
      })}
    </Tabs>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Mini-editor toolbar — server-rendered (plain react-aria), so it's there
          on first paint. It stays on the site's default theme; only the grid
          below re-themes. */}
      <div className="rounded-2xl border bg-card px-4 py-3">
        <ShowcaseCustomizer
          accent={accent}
          onAccentChange={setAccent}
          radius={radius}
          onRadiusChange={setRadius}
          density={density}
          onDensityChange={setDensity}
          editorHref={editorHref}
        />
      </div>

      {/* `scoped` confines the theme — color, radius, density — to the grid, so
          only the charts re-theme (not the toolbar/page). Client-gated because the
          provider's theme effects are layout-effects; pre-hydration the grid
          renders on the site default. */}
      {mounted ? (
        <DesignSystemProvider
          scoped
          density={density}
          tokens={tokens}
          color={color}
        >
          {tabs}
        </DesignSystemProvider>
      ) : (
        tabs
      )}
    </div>
  )
}
