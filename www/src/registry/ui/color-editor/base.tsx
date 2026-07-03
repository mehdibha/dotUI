'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'
import * as ColorPickerPrimitives from 'react-aria-components/ColorPicker'
import { useControlledState } from 'react-stately/useControlledState'

import { cn } from '@/registry/lib/utils'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorSlider } from '@/registry/ui/color-slider'
import { Input } from '@/registry/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

import { useStyles } from './styles'

// MARK: colorEditorStyles

// MARK: Separator

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
  const { root } = useStyles()()
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

// MARK: Separator

interface ColorEditorAreaProps extends React.ComponentProps<'div'> {
  showAlphaChannel?: boolean
}

const ColorEditorArea = ({
  showAlphaChannel = false,
  className,
  ...props
}: ColorEditorAreaProps) => {
  const { area } = useStyles()()
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

// MARK: Separator

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
  const { fields, fieldGroup } = useStyles()()
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

// MARK: Separator

export type { ColorEditorAreaProps, ColorEditorFieldsProps, ColorEditorProps }
export { ColorEditor, ColorEditorArea, ColorEditorFields }
