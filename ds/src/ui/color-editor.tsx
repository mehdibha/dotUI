'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'
import * as ColorPickerPrimitives from 'react-aria-components/ColorPicker'
import { useControlledState } from 'react-stately/useControlledState'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'
import { ColorArea } from '@/ui/color-area'
import { ColorField } from '@/ui/color-field'
import { ColorSlider } from '@/ui/color-slider'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/select'
const colorEditorVariants = tv({
  slots: {
    root: ['flex w-fit flex-col', 'gap-2'],
    area: ['flex', 'gap-2'],
    fields: ['flex flex-col', 'gap-2'],
    fieldGroup: ['flex flex-1 items-center', 'gap-2'],
  },
})

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb'

interface ColorEditorProps extends Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange' | 'color'
> {
  defaultFormat?: ColorFormat
  showAlphaChannel?: boolean
  showFormatSelector?: boolean
  value?: ColorPickerPrimitives.ColorPickerProps['value']
  defaultValue?: ColorPickerPrimitives.ColorPickerProps['defaultValue']
  onChange?: ColorPickerPrimitives.ColorPickerProps['onChange']
}

const ColorEditor = ({
  defaultFormat = 'hex',
  showAlphaChannel = false,
  showFormatSelector = true,
  value,
  defaultValue = '#6366F1',
  onChange,
  className,
  children,
  ...props
}: ColorEditorProps) => {
  const state = React.use(ColorPickerPrimitives.ColorPickerStateContext)
  const { root } = colorEditorVariants()
  const content = (
    <div className={root({ className })} {...props}>
      {children ?? (
        <>
          <ColorEditorArea showAlphaChannel={showAlphaChannel} />
          <ColorEditorFields
            defaultFormat={defaultFormat}
            showFormatSelector={showFormatSelector}
          />
        </>
      )}
    </div>
  )
  // Inside a ColorPicker, adopt its state: the color parts consume the ambient
  // contexts, and value/defaultValue/onChange belong to the picker.
  if (state) return content
  return (
    <ColorPickerPrimitives.ColorPicker
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {content}
    </ColorPickerPrimitives.ColorPicker>
  )
}

interface ColorEditorAreaProps extends React.ComponentProps<'div'> {
  showAlphaChannel?: boolean
}

const ColorEditorArea = ({
  showAlphaChannel = false,
  className,
  ...props
}: ColorEditorAreaProps) => {
  const { area } = colorEditorVariants()
  return (
    <div className={area({ className })} {...props}>
      {props.children ?? (
        <>
          {/* grow (not flex-1): keep the density width as flex basis so the
					    editor hugs it by default and stretches when given a wider root. */}
          <ColorArea
            aria-label="Color"
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            className="grow"
          />
          {/* h-auto self-stretch: track the ColorArea's height (aspect-square, density-sized)
					    rather than the slider's fixed default, so the two stay equal at any density/width. */}
          <ColorSlider
            orientation="vertical"
            colorSpace="hsb"
            channel="hue"
            className="h-auto self-stretch"
          />
          {showAlphaChannel && (
            <ColorSlider
              orientation="vertical"
              colorSpace="hsb"
              channel="alpha"
              className="h-auto self-stretch"
            />
          )}
        </>
      )}
    </div>
  )
}

interface ColorEditorFieldsProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  showFormatSelector?: boolean
}

const ColorEditorFields = ({
  format: formatProp,
  defaultFormat = 'hex',
  onFormatChange,
  showFormatSelector = true,
  className,
  ...props
}: ColorEditorFieldsProps) => {
  const [format, setFormat] = useControlledState(
    formatProp,
    defaultFormat,
    onFormatChange,
  )
  const { fields, fieldGroup } = colorEditorVariants()
  return (
    <div
      className={fields({
        className: cn(format === 'hex' && 'flex-row', className),
      })}
      {...props}
    >
      {showFormatSelector && (
        <Select
          aria-label="Color format"
          value={format}
          onChange={(key) => setFormat(key as ColorFormat)}
          className={cn('w-auto', format === 'hex' && 'flex-1')}
        >
          <SelectTrigger size="sm" className="w-full" />
          <SelectContent>
            <SelectItem id="hex">Hex</SelectItem>
            <SelectItem id="rgb">RGB</SelectItem>
            <SelectItem id="hsl">HSL</SelectItem>
            <SelectItem id="hsb">HSB</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className={fieldGroup()}>
        {format === 'hex' ? (
          <ColorField aria-label="Hex" className="w-10 flex-1">
            <Input size="sm" className="w-full" />
          </ColorField>
        ) : (
          ColorAreaPrimitives.getColorChannels(format).map((channel) => (
            <ColorField
              key={channel}
              colorSpace={format}
              channel={channel}
              className="w-10 flex-1"
            >
              <Input size="sm" className="w-full" />
            </ColorField>
          ))
        )}
      </div>
    </div>
  )
}

export type { ColorEditorAreaProps, ColorEditorFieldsProps, ColorEditorProps }
export { ColorEditor, ColorEditorArea, ColorEditorFields }
