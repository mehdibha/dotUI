import {
  Checkbox,
  CheckboxControl,
  Description,
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Legend,
  Switch,
  SwitchControl,
  TextField,
} from 'www'

const wrap: React.CSSProperties = { width: 360 }

export const LabeledInput = () => (
  <div style={wrap}>
    <FieldGroup>
      <TextField>
        <Label>Username</Label>
        <Input placeholder="johndoe" />
        <Description>Choose a unique username for your account.</Description>
      </TextField>
      <TextField defaultValue="not-an-email" isInvalid>
        <Label>Email address</Label>
        <Input type="email" placeholder="email@example.com" />
        <FieldError>Please enter a valid email address.</FieldError>
      </TextField>
    </FieldGroup>
  </div>
)

export const HorizontalField = () => (
  <div style={wrap}>
    <Field orientation="horizontal">
      <FieldContent>
        <Label>Airplane mode</Label>
        <Description>Disable all wireless connections.</Description>
      </FieldContent>
      <Switch aria-label="Airplane mode">
        <SwitchControl />
      </Switch>
    </Field>
  </div>
)

export const FieldsetGroup = () => (
  <div style={wrap}>
    <Fieldset>
      <Legend>Preferences</Legend>
      <Description>Select all that apply to customize your experience.</Description>
      <FieldGroup style={{ gap: 12 }}>
        <Checkbox defaultSelected>
          <CheckboxControl />
          <Label>Dark mode</Label>
        </Checkbox>
        <Checkbox>
          <CheckboxControl />
          <Label>Compact view</Label>
        </Checkbox>
        <Checkbox>
          <CheckboxControl />
          <Label>Enable notifications</Label>
        </Checkbox>
      </FieldGroup>
    </Fieldset>
  </div>
)
