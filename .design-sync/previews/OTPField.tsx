import { FieldError, Group, Input, Label, OTPField, OTPFieldSeparator } from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const dash: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

export const Basic = () => (
  <div style={wrap}>
    <OTPField length={6}>
      <Label>Verification code</Label>
      <Group>
        <Input />
        <Input aria-label="Digit 2" />
        <Input aria-label="Digit 3" />
        <Input aria-label="Digit 4" />
        <Input aria-label="Digit 5" />
        <Input aria-label="Digit 6" />
      </Group>
    </OTPField>
  </div>
)

export const WithSeparator = () => (
  <div style={wrap}>
    <OTPField length={6} defaultValue="123">
      <Label>Verification code</Label>
      <div style={dash}>
        <Group>
          <Input />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
        </Group>
        <OTPFieldSeparator style={{ padding: '0 8px' }}>-</OTPFieldSeparator>
        <Group>
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </Group>
      </div>
    </OTPField>
  </div>
)

export const FourDigits = () => (
  <div style={wrap}>
    <OTPField length={4} defaultValue="42">
      <Label>PIN</Label>
      <Group>
        <Input />
        <Input aria-label="Digit 2" />
        <Input aria-label="Digit 3" />
        <Input aria-label="Digit 4" />
      </Group>
    </OTPField>
  </div>
)

export const Invalid = () => (
  <div style={wrap}>
    <OTPField length={6} defaultValue="1234" isInvalid>
      <Label>Verification code</Label>
      <Group>
        <Input />
        <Input aria-label="Digit 2" />
        <Input aria-label="Digit 3" />
        <Input aria-label="Digit 4" />
        <Input aria-label="Digit 5" />
        <Input aria-label="Digit 6" />
      </Group>
      <FieldError>Enter the code from your message.</FieldError>
    </OTPField>
  </div>
)
