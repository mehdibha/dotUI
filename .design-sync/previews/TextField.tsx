import {
  Description,
  FieldError,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  TextField,
} from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 280,
}

export const WithDescription = () => (
  <div style={stack}>
    <TextField>
      <Label>Email</Label>
      <Input placeholder="hello@example.com" />
      <Description>We'll never share your email.</Description>
    </TextField>
  </div>
)

export const Invalid = () => (
  <div style={stack}>
    <TextField defaultValue="hello@" isInvalid>
      <Label>Email</Label>
      <Input />
      <FieldError>Enter a valid email address.</FieldError>
    </TextField>
  </div>
)

export const Addons = () => (
  <div style={stack}>
    <TextField>
      <Label>Website</Label>
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input placeholder="acme.com" />
      </InputGroup>
    </TextField>
  </div>
)

export const Disabled = () => (
  <div style={stack}>
    <TextField value="hello@example.com" isDisabled>
      <Label>Email</Label>
      <Input />
    </TextField>
  </div>
)
