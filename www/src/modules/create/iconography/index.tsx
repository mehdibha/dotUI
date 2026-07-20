import type { IconLibraryName } from '@/registry/icons/icon-map'
import { FieldGroup, Label } from '@/registry/ui/field'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'

import { useDesignSystem } from '../preset'

const iconLibraries: Array<{
  name: string
  value: IconLibraryName
  description: string
}> = [
  { name: 'Lucide', value: 'lucide', description: 'Clean & consistent' },
  { name: 'Remix Icons', value: 'remix', description: 'Neutral & versatile' },
  { name: 'Tabler Icons', value: 'tabler', description: 'Over 5000 icons' },
  { name: 'Huge Icons', value: 'hugeicons', description: 'Modern & bold' },
]

export function IconographyConfig() {
  const { designSystem, setIconLibrary } = useDesignSystem()

  return (
    <div>
      <RadioGroup
        aria-label="Icon library"
        value={designSystem.icons ?? 'lucide'}
        onChange={(value) => setIconLibrary(value as IconLibraryName)}
      >
        <FieldGroup className="gap-1">
          {iconLibraries.map((lib) => (
            <Radio key={lib.value} value={lib.value}>
              <RadioControl className="justify-between rounded-lg border p-4 hover:bg-neutral selected:border-border-control selected:bg-neutral-hover/80 selected:text-fg">
                <Label className="text-fg!">{lib.name}</Label>
                <RadioIndicator />
              </RadioControl>
            </Radio>
          ))}
        </FieldGroup>
      </RadioGroup>
    </div>
  )
}
