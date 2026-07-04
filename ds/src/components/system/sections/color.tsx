'use client'

import { useState } from 'react'

import { ContrastLab } from '@/components/explorer/contrast-lab'
import { ContrastTable } from '@/components/explorer/contrast-table'
import { ModeSwitcher } from '@/components/explorer/mode-switcher'
import { RampGrid } from '@/components/explorer/ramp-grid'
import { SectionNotes } from '@/components/explorer/section-notes'
import { SpecTable } from '@/components/explorer/spec-table'
import { TokenTable } from '@/components/explorer/token-table'
import type { SystemWithColors } from '@/data/schema'

import { Block, Section } from '../primitives'

export function ColorSection({ system }: { system: SystemWithColors }) {
  const { colors } = system
  const [mode, setMode] = useState(colors.modes[0] ?? 'light')

  const guarantees = [
    ...new Map(
      colors.contrast
        .filter((pair) => pair.sweep)
        .map((pair) => [
          `${pair.sweep!.fgStep}-${pair.sweep!.bgStep}`,
          pair.sweep!,
        ]),
    ).values(),
  ]

  return (
    <Section
      title="Color System"
      kicker="Foundations"
      intro="Spectrum 2 ships 18 chromatic families plus grays and transparents, each a 16-step ramp resolved per color scheme — light, dark, and a low-fidelity wireframe. Product code never touches these raw ramps; it reaches them through concept scales and purpose-named aliases."
    >
      <Block
        title="Palette"
        description="Every shipped ramp, exactly as the system resolves it. Click a swatch for its per-mode values and live contrast."
        aside={
          <ModeSwitcher modes={colors.modes} mode={mode} onChange={setMode} />
        }
      >
        <RampGrid ramps={colors.ramps} mode={mode} />
        <SectionNotes
          notes={colors.notes.filter((note) => note.section === 'palette')}
        />
      </Block>

      {colors.tokenGroups.length > 0 && (
        <Block
          title="Semantic & component tokens"
          description="The concept scales, purpose-named aliases, and per-component tokens — searchable across names, references, and resolved values."
        >
          <TokenTable groups={colors.tokenGroups} modes={colors.modes} />
          <SectionNotes
            notes={colors.notes.filter((note) => note.section === 'tokens')}
          />
        </Block>
      )}

      {colors.focus.length > 0 && (
        <Block
          title="Focus"
          description="How the keyboard-focus indicator is built and where its color comes from."
        >
          <SpecTable entries={colors.focus} />
        </Block>
      )}

      {colors.contrast.length > 0 && (
        <Block
          title="Contrast"
          description="Documented guarantees and observed measurements — never conflated. Re-measure any pair on any ramp."
        >
          <ContrastTable pairs={colors.contrast} />
          {colors.ramps.length > 0 && (
            <div className="mt-8">
              <ContrastLab
                ramps={colors.ramps}
                modes={colors.modes}
                guarantees={guarantees}
              />
            </div>
          )}
          <SectionNotes
            notes={colors.notes.filter((note) => note.section === 'contrast')}
          />
        </Block>
      )}
    </Section>
  )
}
