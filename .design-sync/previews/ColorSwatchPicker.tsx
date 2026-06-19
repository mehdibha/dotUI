import { ColorSwatchPicker, ColorSwatchPickerItem } from 'www'

const wrap: React.CSSProperties = { maxWidth: 220 }

export const Default = () => (
  <div style={wrap}>
    <ColorSwatchPicker defaultValue="#08f">
      <ColorSwatchPickerItem color="#fff" />
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#f80" />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#08f" />
      <ColorSwatchPickerItem color="#088" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  </div>
)

export const Disabled = () => (
  <div style={wrap}>
    <ColorSwatchPicker defaultValue="#A00">
      <ColorSwatchPickerItem color="#fff" isDisabled />
      <ColorSwatchPickerItem color="#A00" />
      <ColorSwatchPickerItem color="#f80" isDisabled />
      <ColorSwatchPickerItem color="#080" />
      <ColorSwatchPickerItem color="#08f" isDisabled />
      <ColorSwatchPickerItem color="#088" />
      <ColorSwatchPickerItem color="#008" />
    </ColorSwatchPicker>
  </div>
)
