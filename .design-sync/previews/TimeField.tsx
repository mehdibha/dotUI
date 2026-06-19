import { Time } from '@internationalized/date'
import {
  DateInput,
  Description,
  FieldError,
  Label,
  TimeField,
} from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 240,
}

export const WithValue = () => (
  <div style={stack}>
    <TimeField defaultValue={new Time(9, 30)}>
      <Label>Appointment time</Label>
      <DateInput />
      <Description>Between 9 AM and 5 PM.</Description>
    </TimeField>
  </div>
)

export const Granularity = () => (
  <div style={stack}>
    <TimeField granularity="second" defaultValue={new Time(11, 45, 22)}>
      <Label>Start time</Label>
      <DateInput />
    </TimeField>
  </div>
)

export const Invalid = () => (
  <div style={stack}>
    <TimeField isInvalid defaultValue={new Time(8, 7)}>
      <Label>Meeting time</Label>
      <DateInput />
      <FieldError>Meetings start every 15 minutes.</FieldError>
    </TimeField>
  </div>
)

export const Disabled = () => (
  <div style={stack}>
    <TimeField isDisabled defaultValue={new Time(14, 0)}>
      <Label>Event time</Label>
      <DateInput />
    </TimeField>
  </div>
)
