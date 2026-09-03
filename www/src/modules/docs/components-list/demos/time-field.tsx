import { Time } from "@internationalized/date"

import { Label } from "@/registry/ui/field"
import { DateInput } from "@/registry/ui/input"
import { TimeField } from "@/registry/ui/time-field"

export function TimeFieldDemo() {
  return (
    <TimeField
      defaultValue={new Time(11, 45)}
      className="w-full max-w-[11.5rem]"
    >
      <Label>Event time</Label>
      <DateInput className="w-full" />
    </TimeField>
  )
}
