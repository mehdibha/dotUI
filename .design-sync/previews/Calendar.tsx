import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar, RangeCalendar } from 'www'

const now = today(getLocalTimeZone())

const wrap: React.CSSProperties = { display: 'inline-flex' }

export const Single = () => (
  <div style={wrap}>
    <Calendar aria-label="Event date" defaultValue={now} />
  </div>
)

export const Range = () => (
  <div style={wrap}>
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: now.subtract({ days: 6 }), end: now }}
    />
  </div>
)

export const Disabled = () => (
  <div style={wrap}>
    <Calendar aria-label="Date" defaultValue={now} isDisabled />
  </div>
)
