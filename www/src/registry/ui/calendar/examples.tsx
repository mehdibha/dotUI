import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import BookedDatesDemo from "./demos/booked-dates"
import CustomDaysDemo from "./demos/custom-days"
import DisabledDemo from "./demos/disabled-example"
import InternationalDemo from "./demos/international"
import InvalidDemo from "./demos/invalid"
import MinMaxDemo from "./demos/min-max"
import RangeDemo from "./demos/range"
import RangeMultipleMonthsDemo from "./demos/range-multiple-months"
import SchedulerDemo from "./demos/scheduler"
import ShortWeekdaysDemo from "./demos/short-weekdays"
import SingleDemo from "./demos/single"
import TodayIndicatorDemo from "./demos/today-indicator"
import UnavailableWeekendsDemo from "./demos/unavailable-weekends"
import WithDropdownsDemo from "./demos/with-dropdowns"
import WithPresetsDemo from "./demos/with-presets"
import WithTimeDemo from "./demos/with-time"

export default function CalendarExamples() {
  return (
    <Examples className="**:data-example-preview:items-center **:data-example-preview:justify-center lg:grid-cols-2">
      <Example title="Single">
        <SingleDemo />
      </Example>
      <Example title="Range">
        <RangeDemo />
      </Example>
      <Example title="Range multiple months" className="lg:col-span-2">
        <RangeMultipleMonthsDemo />
      </Example>
      <Example title="Booked dates">
        <BookedDatesDemo />
      </Example>
      <Example title="With presets">
        <WithPresetsDemo />
      </Example>
      <Example title="With time">
        <WithTimeDemo />
      </Example>
      <Example title="With dropdowns">
        <WithDropdownsDemo />
      </Example>
      <Example title="Short weekdays">
        <ShortWeekdaysDemo />
      </Example>
      <Example title="Custom days" className="lg:col-span-2">
        <CustomDaysDemo />
      </Example>
      <Example title="Disabled">
        <DisabledDemo />
      </Example>
      <Example title="Min & max">
        <MinMaxDemo />
      </Example>
      <Example title="Unavailable weekends">
        <UnavailableWeekendsDemo />
      </Example>
      <Example title="Invalid">
        <InvalidDemo />
      </Example>
      <Example title="Today indicator">
        <TodayIndicatorDemo />
      </Example>
      <Example title="International (Arabic)">
        <InternationalDemo />
      </Example>
      <Example title="Scheduler" className="lg:col-span-2">
        <SchedulerDemo />
      </Example>
    </Examples>
  )
}
