import {
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from 'www'

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 240,
}

export const Basic = () => (
  <div style={col}>
    <NumberField defaultValue={1024}>
      <Label>Width</Label>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  </div>
)

export const Sizes = () => (
  <div style={col}>
    <NumberField aria-label="Small" defaultValue={1024}>
      <Group>
        <NumberFieldDecrement size="sm" />
        <Input size="sm" />
        <NumberFieldIncrement size="sm" />
      </Group>
    </NumberField>
    <NumberField aria-label="Medium" defaultValue={1024}>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
    <NumberField aria-label="Large" defaultValue={1024}>
      <Group>
        <NumberFieldDecrement size="lg" />
        <Input size="lg" />
        <NumberFieldIncrement size="lg" />
      </Group>
    </NumberField>
  </div>
)

export const Currency = () => (
  <div style={col}>
    <NumberField
      defaultValue={45}
      formatOptions={{ style: 'currency', currency: 'USD' }}
    >
      <Label>Price</Label>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  </div>
)

export const States = () => (
  <div style={col}>
    <NumberField defaultValue={1024} isInvalid>
      <Label>Width</Label>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
      <FieldError>Please enter a valid number.</FieldError>
    </NumberField>
    <NumberField defaultValue={1024} isDisabled>
      <Label>Disabled</Label>
      <Group>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </Group>
    </NumberField>
  </div>
)
