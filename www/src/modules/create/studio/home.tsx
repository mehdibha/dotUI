'use client'

import { BlocksIcon } from 'lucide-react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { useDesignSystem } from '../preset'
import { BrandFrontDoor } from './brand'
import { TWEAKABLE_COMPONENTS } from './components-browser'
import {
  BACKDROP_BLUR_VAR,
  DEFAULT_RADIUS_FACTOR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  ICON_STROKE_VAR,
  MOTION_DURATION_VAR,
  RADIUS_FACTOR_VAR,
  STYLE_FAMILIES,
} from './data'
import { GroupLabel, SectionCard } from './primitives'
import { useStudio } from './store'
import { FOUNDATION_INDEX } from './views'

/* ----------------------------------------------------------------------------
 * The home view: Brand front door → Foundations → Components. Foundation cards
 * each render a live summary of their current value and act as the door into a
 * deep editor. Simple mode shows the headline foundations; Pro reveals the full
 * set. Everything is always reachable from the command palette (⌘K).
 * -------------------------------------------------------------------------- */

export function StudioHome() {
  const { level, navigate } = useStudio()
  const { designSystem } = useDesignSystem()
  const tokens = designSystem.tokens
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  function summaryFor(id: string): string {
    switch (id) {
      case 'color':
        return `${config.algorithm} · ${config.seeds.accent}`
      case 'typography':
        return `${tokens[FONT_HEADING_VAR] ?? 'Geist'} / ${tokens[FONT_BODY_VAR] ?? 'Geist'}`
      case 'shape': {
        const r = Number.parseFloat(
          tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR,
        )
        return `Radius ${(Number.isFinite(r) ? r : 1).toFixed(2)}×`
      }
      case 'spacing':
        return `${designSystem.density} density`
      case 'elevation': {
        const fam = tokens['--ds-style-family'] ?? 'soft'
        const blur = tokens[BACKDROP_BLUR_VAR]
        return (
          (STYLE_FAMILIES.find((s) => s.value === fam)?.label ?? fam) +
          (blur && Number(blur) > 0 ? ` · ${blur}px blur` : '')
        )
      }
      case 'motion':
        return `${tokens[MOTION_DURATION_VAR] ?? '150'}ms transitions`
      case 'icons':
        return `Lucide · ${tokens[ICON_STROKE_VAR] ?? '2'}px stroke`
      case 'interaction':
        return `${tokens['--cursor-interactive'] ?? 'default'} cursor`
      case 'modes':
        return `Boots in ${tokens['--ds-default-mode'] ?? 'system'}`
      case 'chart-colors':
        return '5-colour categorical'
      default:
        return ''
    }
  }

  function trailingFor(id: string) {
    if (id === 'color') {
      return (
        <span className="flex -space-x-1">
          {[
            config.seeds.accent,
            config.seeds.neutral,
            config.seeds.success,
          ].map((c, i) => (
            <span
              key={i}
              className="size-4 rounded-full ring-1 ring-bg"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      )
    }
    if (id === 'chart-colors') {
      return (
        <span className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className="size-3 rounded-sm"
              style={{ backgroundColor: `var(--chart-${n})` }}
            />
          ))}
        </span>
      )
    }
    return undefined
  }

  const foundations =
    level === 'simple'
      ? FOUNDATION_INDEX.filter((f) => f.simple)
      : FOUNDATION_INDEX

  return (
    <div className="flex flex-col gap-5 p-3">
      <BrandFrontDoor />

      <div className="flex flex-col gap-2">
        <GroupLabel className="px-1">Foundations</GroupLabel>
        <div className="flex flex-col gap-2">
          {foundations.map((f) => (
            <SectionCard
              key={f.id}
              icon={f.icon}
              label={f.label}
              summary={summaryFor(f.id)}
              trailing={trailingFor(f.id)}
              live={level === 'pro' ? f.live : undefined}
              onPress={() => navigate(f.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <GroupLabel className="px-1">Components</GroupLabel>
        <SectionCard
          icon={BlocksIcon}
          label="Component styles"
          summary={`${TWEAKABLE_COMPONENTS.length} components · synced groups`}
          onPress={() => navigate('components')}
        />
      </div>
    </div>
  )
}
