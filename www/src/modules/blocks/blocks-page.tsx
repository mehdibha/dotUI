'use client'

import { useMemo } from 'react'

import { registryBlocks } from '@/registry/blocks/registry'
import type { BlockCategory } from '@/registry/types'
import { LinkButton } from '@/registry/ui/button'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/page-hero'
import { encodePreset } from '@/modules/create/preset/codec'
import { useStoredPreset } from '@/modules/create/preset/storage'

import { BlockCard } from './block-card'
import { blockEditorHref } from './lib'

const CATEGORY_ORDER: BlockCategory[] = ['layout', 'page', 'section']
const CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: 'Layouts',
  page: 'Pages',
  section: 'Sections',
}

export function BlocksPage() {
  // Preview every block in the visitor's own (stored) design system.
  const ds = useStoredPreset()
  const presetParam = useMemo(() => {
    const enc = encodePreset(ds)
    return enc ? `?preset=${enc}` : ''
  }, [ds])

  const count = registryBlocks.length

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* The <main> landmark lives in the shared _app layout; use a fragment here
          so we don't nest a second one. */}
      <>
        <PageHero
          eyebrow="Blocks & layouts"
          title={
            <>
              Add ready-made <span className="font-bold italic">screens</span>.
            </>
          }
          description={`${count} block${count === 1 ? '' : 's'}, each themed by your design system. Pick a variant and ship it as code you own.`}
        >
          <LinkButton href="/create" variant="primary" size="lg">
            Launch the editor
          </LinkButton>
          <LinkButton href="/presets" variant="default" size="lg">
            Browse presets
          </LinkButton>
        </PageHero>

        <div className="container mt-12 flex flex-col gap-12 sm:mt-16">
          {CATEGORY_ORDER.map((cat) => {
            const items = registryBlocks.filter((b) => b.category === cat)
            if (items.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="mb-4 pl-1 text-sm font-medium text-fg-muted">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((block) => (
                    <BlockCard
                      key={block.name}
                      block={block}
                      presetParam={presetParam}
                      href={blockEditorHref(
                        ds,
                        block.name,
                        block.params.variant.default,
                      )}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </>

      <Footer />
    </div>
  )
}
