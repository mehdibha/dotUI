import { ChevronDown } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ColorSwatch } from '@/registry/ui/color-swatch'

export default function Demo() {
  return (
    <Button variant="default" className="w-full max-w-xs justify-between">
      <span className="flex items-center gap-2">
        <ColorSwatch color="#8b5cf6" className="size-4" />
        Violet
      </span>
      <ChevronDown className="text-fg-muted" />
    </Button>
  )
}
