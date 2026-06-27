'use client'

import { useState } from 'react'

import { LinkButton } from '@/registry/ui/button'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/page-hero'

import { PresetCard } from './preset-card'
import { PresetModal } from './preset-modal'
import { PRESETS, type Preset } from './presets-data'

export function PresetsPage() {
  // The presented preset, or null when the modal is closed.
  const [selected, setSelected] = useState<Preset | null>(null)

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        <PageHero
          eyebrow="Curated design systems"
          title={
            <>
              Start from a{' '}
              <span className="font-bold italic">beautiful preset</span>.
            </>
          }
          description={`${PRESETS.length} ready-made design systems. Preview one live, then open it in the editor and make it yours.`}
        >
          <LinkButton href="/create" variant="primary" size="lg">
            Launch the editor
          </LinkButton>
          <LinkButton href="/docs/components" variant="default" size="lg">
            View components
          </LinkButton>
        </PageHero>

        {/* Gallery — the same grid rhythm as the /charts showcase. */}
        <section className="container mt-12 sm:mt-16">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onSelect={() => setSelected(preset)}
              />
            ))}
          </div>
        </section>
      </>

      <PresetModal
        preset={selected}
        isOpen={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <Footer />
    </div>
  )
}
