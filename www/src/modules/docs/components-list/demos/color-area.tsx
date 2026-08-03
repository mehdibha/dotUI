import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import { ColorArea } from '@/registry/ui/color-area'

export function ColorAreaDemo() {
  return (
    <ColorArea
      defaultValue={ColorAreaPrimitives.parseColor('hsl(0, 95%, 60%)')}
    />
  )
}
