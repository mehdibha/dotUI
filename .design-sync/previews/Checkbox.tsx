import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
  Description,
  FieldContent,
  Label,
} from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 360,
}

export const States = () => (
  <div style={stack}>
    <Checkbox>
      <CheckboxControl />
      <Label>I accept the terms and conditions</Label>
    </Checkbox>
    <Checkbox defaultSelected>
      <CheckboxControl />
      <Label>Subscribe to the newsletter</Label>
    </Checkbox>
    <Checkbox isIndeterminate>
      <CheckboxControl />
      <Label>Select all items</Label>
    </Checkbox>
    <Checkbox isDisabled>
      <CheckboxControl />
      <Label>Disabled option</Label>
    </Checkbox>
    <Checkbox isInvalid>
      <CheckboxControl />
      <Label>Accept terms and conditions</Label>
    </Checkbox>
  </div>
)

export const WithDescription = () => (
  <div style={stack}>
    <Checkbox defaultSelected>
      <CheckboxControl />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Label>Accept terms and conditions</Label>
        <Description>By clicking this checkbox, you agree to the terms and conditions.</Description>
      </div>
    </Checkbox>
  </div>
)

export const Card = () => (
  <div style={stack}>
    <Checkbox style={{ width: '100%' }}>
      <CheckboxControl>
        <CheckboxIndicator />
        <FieldContent>
          <Label>Enable two-factor authentication</Label>
          <Description>Add an extra layer of security to your account.</Description>
        </FieldContent>
      </CheckboxControl>
    </Checkbox>
  </div>
)
