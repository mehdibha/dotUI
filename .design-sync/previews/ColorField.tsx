import { ColorField, Description, FieldError, Input, Label } from 'www'

const wrap: React.CSSProperties = { width: 240 }
const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 }

export const Default = () => (
  <div style={wrap}>
    <ColorField defaultValue="#6366f1">
      <Label>Color</Label>
      <Input />
    </ColorField>
  </div>
)

export const WithDescription = () => (
  <div style={wrap}>
    <ColorField defaultValue="#22c55e">
      <Label>Background</Label>
      <Input />
      <Description>Enter a background color.</Description>
    </ColorField>
  </div>
)

export const States = () => (
  <div style={{ ...wrap, ...stack }}>
    <ColorField isInvalid defaultValue="#f43f5e">
      <Label>Color</Label>
      <Input />
      <FieldError>Please enter a valid color.</FieldError>
    </ColorField>
    <ColorField isDisabled defaultValue="#94a3b8">
      <Label>Color</Label>
      <Input />
    </ColorField>
  </div>
)
