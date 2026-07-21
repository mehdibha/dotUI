import { ChevronDownIcon } from '@/registry/__generated__/icons'
import { phosphorWeights } from '@/registry/icons/icon-map'
import type { IconLibraryName, PhosphorWeight } from '@/registry/icons/icon-map'
import { Button } from '@/registry/ui/button'
import { FieldGroup, Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'

import { useDesignSystem } from '../preset'

export const ICON_STROKE_WIDTH_VAR = '--icon-stroke-width'
export const ICON_WEIGHT_VAR = '--icon-weight'

const iconLibraries: Array<{
  name: string
  value: IconLibraryName
  description: string
}> = [
  { name: 'Lucide', value: 'lucide', description: 'Clean & consistent' },
  { name: 'Remix Icons', value: 'remix', description: 'Neutral & versatile' },
  { name: 'Tabler Icons', value: 'tabler', description: 'Over 5000 icons' },
  { name: 'Huge Icons', value: 'hugeicons', description: 'Modern & bold' },
  { name: 'Phosphor', value: 'phosphor', description: 'Friendly & rounded' },
]

/** Stroke-based libraries the stroke-width axis applies to, with their defaults. */
const STROKE_DEFAULTS: Partial<Record<IconLibraryName, number>> = {
  lucide: 2,
  tabler: 2,
  hugeicons: 1.5,
}

export function IconographyConfig() {
  const { designSystem, setIconLibrary, setToken } = useDesignSystem()
  const library = designSystem.icons ?? 'lucide'

  const strokeDefault = STROKE_DEFAULTS[library]
  const strokeToken = designSystem.tokens[ICON_STROKE_WIDTH_VAR]
  const strokeParsed = Number.parseFloat(strokeToken ?? '')
  const strokeValue = Number.isFinite(strokeParsed)
    ? strokeParsed
    : (strokeDefault ?? 2)

  const weightToken = designSystem.tokens[ICON_WEIGHT_VAR]
  const weight = phosphorWeights.includes(weightToken as PhosphorWeight)
    ? (weightToken as PhosphorWeight)
    : 'regular'

  return (
    <div className="flex flex-col gap-5">
      <RadioGroup
        aria-label="Icon library"
        value={library}
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

      {/* Stroke width — only for stroke-based libraries (filled sets have no strokes). */}
      {strokeDefault !== undefined && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">
              Stroke width
            </span>
            <span className="text-xs font-medium text-fg tabular-nums">
              {strokeValue.toFixed(2)}
            </span>
          </div>
          <Slider
            aria-label="Icon stroke width"
            value={strokeValue}
            minValue={1}
            maxValue={3}
            step={0.25}
            onChange={(v) => setToken(ICON_STROKE_WIDTH_VAR, String(v))}
          >
            <SliderControl />
          </Slider>
        </div>
      )}

      {/* Weight — only for libraries whose components take a weight prop (phosphor). */}
      {library === 'phosphor' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-fg-muted">Weight</span>
          <Select
            aria-label="Icon weight"
            selectedKey={weight}
            onSelectionChange={(key) =>
              setToken(ICON_WEIGHT_VAR, key as string)
            }
          >
            <Button size="sm" className="w-full">
              <SelectValue className="capitalize" />
              <ChevronDownIcon data-icon-end="" />
            </Button>
            <Popover>
              <ListBox>
                {phosphorWeights.map((w) => (
                  <ListBoxItem key={w} id={w} className="capitalize">
                    {w}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>
      )}
    </div>
  )
}
