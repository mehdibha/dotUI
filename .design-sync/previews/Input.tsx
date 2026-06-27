import { Description, Label, TextField } from 'www'
import { Input } from 'www'

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: 280,
}

const fieldCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 280,
}

export const Basic = () => (
  <div style={col}>
    <Input type="email" placeholder="Email" />
    <Input type="search" placeholder="Search..." />
    <Input type="password" placeholder="Password" />
  </div>
)

export const Sizes = () => (
  <div style={col}>
    <Input size="sm" placeholder="Small" />
    <Input size="md" placeholder="Medium" />
    <Input size="lg" placeholder="Large" />
  </div>
)

export const WithLabel = () => (
  <div style={fieldCol}>
    <TextField>
      <Label>Email</Label>
      <Input type="email" placeholder="name@example.com" />
      <Description>We&apos;ll never share your email.</Description>
    </TextField>
  </div>
)

export const States = () => (
  <div style={fieldCol}>
    <TextField isInvalid>
      <Label>Username</Label>
      <Input type="text" placeholder="Invalid" />
    </TextField>
    <TextField isDisabled>
      <Label>Email</Label>
      <Input type="email" placeholder="Disabled" />
    </TextField>
  </div>
)
