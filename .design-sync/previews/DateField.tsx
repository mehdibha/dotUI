import { parseDate } from '@internationalized/date'
import { DateField, DateInput, Description, FieldError, Label } from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 280,
}

export const Basic = () => (
  <div style={stack}>
    <DateField>
      <Label>Appointment date</Label>
      <DateInput />
    </DateField>
  </div>
)

export const WithValue = () => (
  <div style={stack}>
    <DateField defaultValue={parseDate('2024-07-15')}>
      <Label>Event date</Label>
      <DateInput />
      <Description>Pick the day your event starts.</Description>
    </DateField>
  </div>
)

export const Invalid = () => (
  <div style={stack}>
    <DateField isInvalid>
      <Label>Event date</Label>
      <DateInput />
      <FieldError>Please select a date.</FieldError>
    </DateField>
  </div>
)

export const Disabled = () => (
  <div style={stack}>
    <DateField isDisabled defaultValue={parseDate('2024-07-15')}>
      <Label>Appointment date</Label>
      <DateInput />
    </DateField>
  </div>
)
