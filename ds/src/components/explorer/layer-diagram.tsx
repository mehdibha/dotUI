import { ArrowRightIcon } from 'lucide-react'

import type { Layer } from '@/data/schema'
import { Badge } from '@/ui/badge'

const kindVariant = {
  primitive: 'neutral',
  semantic: 'info',
  component: 'success',
} as const

interface LayerDiagramProps {
  layers: Layer[]
}

/** Raw values → components: the token layering as a flow diagram. */
export function LayerDiagram({ layers }: LayerDiagramProps) {
  return (
    <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
      {layers.map((layer, index) => (
        <div key={layer.name} className="contents">
          {index > 0 && (
            <ArrowRightIcon className="mx-auto size-4 flex-none rotate-90 text-fg-muted lg:mx-0 lg:rotate-0" />
          )}
          <div className="flex flex-1 flex-col gap-1.5 rounded-lg border p-4">
            <Badge appearance="subtle" variant={kindVariant[layer.kind]}>
              {layer.kind}
            </Badge>
            <p className="text-sm font-medium">{layer.name}</p>
            <code className="font-mono text-xs break-words text-fg-muted">
              {layer.example}
            </code>
            {layer.note && (
              <p className="text-xs text-fg-muted">{layer.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
