import { use, useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { DesignSystemProvider } from '@/lib/styles'
import {
  ExamplesIndex,
  GroupExamplesIndex,
} from '@/modules/create/__generated__/examples'
import {
  DEFAULTS,
  decodePreset,
  useIframeMessageListener,
} from '@/modules/create/preset'
import type { DesignSystem } from '@/modules/create/preset'

const promiseCache = new Map<
  string,
  Promise<{ default: React.ComponentType }>
>()

function getExamplesPromise(slug: string) {
  let promise = promiseCache.get(slug)
  if (!promise) {
    // Group/block slugs share one namespace with component slugs and win the
    // lookup — e.g. the "cards" block resolves here before the "card" component.
    // A new block must not reuse a component's slug or it will silently shadow it.
    const load = GroupExamplesIndex[slug] ?? ExamplesIndex[slug]
    if (!load) return null
    promise = load()
    promiseCache.set(slug, promise)
  }
  return promise
}

export const Route = createFileRoute('/preview/$slug')({
  validateSearch: z.object({ preset: z.string().optional().catch(undefined) }),
  ssr: false,
  beforeLoad: ({ params }) => {
    getExamplesPromise(params.slug)
  },
  component: PreviewPage,
})

function PreviewPage() {
  const { slug } = Route.useParams()
  const { preset } = Route.useSearch()
  const [designSystem, setDesignSystem] = useState<DesignSystem>(() =>
    preset ? decodePreset(preset) : DEFAULTS,
  )

  useIframeMessageListener(
    useCallback((ds: DesignSystem) => setDesignSystem(ds), []),
  )

  const promise = getExamplesPromise(slug)

  if (!promise) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-fg-muted">Preview not found</span>
      </div>
    )
  }

  const { default: Examples } = use(promise)

  return (
    <DesignSystemProvider
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
    >
      <Examples />
    </DesignSystemProvider>
  )
}
