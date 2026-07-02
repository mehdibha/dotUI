import { PaletteIcon } from 'lucide-react'

import { ColorField } from '@/registry/ui/color-field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <ColorField aria-label="Color field with prefix">
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <PaletteIcon />
          </InputGroupAddon>
        </InputGroup>
      </ColorField>
      <ColorField aria-label="Color field with suffix">
        <InputGroup>
          <InputGroupAddon>
            <PaletteIcon />
          </InputGroupAddon>
          <Input />
        </InputGroup>
      </ColorField>
    </div>
  )
}
