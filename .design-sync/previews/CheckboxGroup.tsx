import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  Description,
  FieldContent,
  FieldError,
  FieldGroup,
  Label,
} from 'www'

const wrap: React.CSSProperties = { width: '100%', maxWidth: 320 }

export const Default = () => (
  <div style={wrap}>
    <CheckboxGroup defaultValue={['nextjs']}>
      <Label>React frameworks</Label>
      <Description>You can pick any frameworks.</Description>
      <FieldGroup>
        <Checkbox value="nextjs">
          <CheckboxControl />
          <Label>Next.js</Label>
        </Checkbox>
        <Checkbox value="remix">
          <CheckboxControl />
          <Label>Remix</Label>
        </Checkbox>
        <Checkbox value="gatsby">
          <CheckboxControl />
          <Label>Gatsby</Label>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  </div>
)

export const Invalid = () => (
  <div style={wrap}>
    <CheckboxGroup isInvalid>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Checkbox value="nextjs">
          <CheckboxControl />
          <Label>Next.js</Label>
        </Checkbox>
        <Checkbox value="remix">
          <CheckboxControl />
          <Label>Remix</Label>
        </Checkbox>
      </FieldGroup>
      <FieldError>Please select a framework.</FieldError>
    </CheckboxGroup>
  </div>
)

export const Cards = () => (
  <div style={wrap}>
    <CheckboxGroup defaultValue={['nextjs']}>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Checkbox value="nextjs">
          <CheckboxControl>
            <CheckboxIndicator />
            <FieldContent>
              <Label>Next.js</Label>
              <Description>The React framework for the web</Description>
            </FieldContent>
          </CheckboxControl>
        </Checkbox>
        <Checkbox value="remix">
          <CheckboxControl>
            <CheckboxIndicator />
            <FieldContent>
              <Label>Remix</Label>
              <Description>Full stack web framework</Description>
            </FieldContent>
          </CheckboxControl>
        </Checkbox>
      </FieldGroup>
    </CheckboxGroup>
  </div>
)
