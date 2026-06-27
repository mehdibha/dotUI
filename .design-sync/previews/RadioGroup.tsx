import {
  Description,
  FieldContent,
  FieldError,
  FieldGroup,
  Label,
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from 'www'

const wrap: React.CSSProperties = { width: '100%', maxWidth: 320 }

export const Default = () => (
  <div style={wrap}>
    <RadioGroup defaultValue="nextjs">
      <Label>React frameworks</Label>
      <Description>You can pick one framework.</Description>
      <FieldGroup>
        <Radio value="nextjs">
          <RadioControl />
          <Label>Next.js</Label>
        </Radio>
        <Radio value="remix">
          <RadioControl />
          <Label>Remix</Label>
        </Radio>
        <Radio value="gatsby">
          <RadioControl />
          <Label>Gatsby</Label>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  </div>
)

export const Cards = () => (
  <div style={wrap}>
    <RadioGroup defaultValue="nextjs">
      <Label>React frameworks</Label>
      <FieldGroup>
        <Radio value="nextjs">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Next.js</Label>
              <Description>The React framework for the web</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="remix">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Remix</Label>
              <Description>Full stack web framework</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  </div>
)

export const Invalid = () => (
  <div style={wrap}>
    <RadioGroup isInvalid>
      <Label>React frameworks</Label>
      <FieldGroup>
        <Radio value="nextjs">
          <RadioControl />
          <Label>Next.js</Label>
        </Radio>
        <Radio value="remix">
          <RadioControl />
          <Label>Remix</Label>
        </Radio>
        <Radio value="gatsby">
          <RadioControl />
          <Label>Gatsby</Label>
        </Radio>
      </FieldGroup>
      <FieldError>Please select a framework.</FieldError>
    </RadioGroup>
  </div>
)
