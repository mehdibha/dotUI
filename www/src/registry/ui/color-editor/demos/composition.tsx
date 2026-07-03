import {
  ColorEditor,
  ColorEditorArea,
  ColorEditorFields,
} from '@/registry/ui/color-editor'
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '@/registry/ui/color-swatch-picker'

export default function Demo() {
  return (
    <ColorEditor defaultValue="#f80">
      <ColorEditorArea showAlphaChannel />
      <ColorSwatchPicker
        aria-label="Color swatches"
        className="justify-between"
      >
        <ColorSwatchPickerItem color="#A00" />
        <ColorSwatchPickerItem color="#f80" />
        <ColorSwatchPickerItem color="#080" />
        <ColorSwatchPickerItem color="#08f" />
        <ColorSwatchPickerItem color="#008" />
      </ColorSwatchPicker>
      <ColorEditorFields defaultFormat="rgb" showFormatSelector={false} />
    </ColorEditor>
  )
}
