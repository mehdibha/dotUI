import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";

import BookedDatesDemo from "./demos/booked-dates";
import CustomDaysDemo from "./demos/custom-days";
import DisabledDemo from "./demos/disabled-example";
import InternationalDemo from "./demos/international";
import InvalidDemo from "./demos/invalid";
import MinMaxDemo from "./demos/min-max";
import RangeDemo from "./demos/range";
import RangeMultipleMonthsDemo from "./demos/range-multiple-months";
import SchedulerDemo from "./demos/scheduler";
import ShortWeekdaysDemo from "./demos/short-weekdays";
import SingleDemo from "./demos/single";
import TodayIndicatorDemo from "./demos/today-indicator";
import UnavailableWeekendsDemo from "./demos/unavailable-weekends";
import WithDropdownsDemo from "./demos/with-dropdowns";
import WithPresetsDemo from "./demos/with-presets";
import WithSlottedPickersDemo from "./demos/with-slotted-pickers";
import WithTimeDemo from "./demos/with-time";

export default function CalendarExamples() {
	return (
		<Examples className="**:data-example-preview:items-center **:data-example-preview:justify-center lg:grid-cols-2">
			<Example title="Single">
				<SingleDemo />
			</Example>
			<Example title="Range">
				<RangeDemo />
			</Example>
			<Example title="Range Multiple Months" className="lg:col-span-2">
				<RangeMultipleMonthsDemo />
			</Example>
			<Example title="Booked Dates">
				<BookedDatesDemo />
			</Example>
			<Example title="With Presets">
				<WithPresetsDemo />
			</Example>
			<Example title="With Time">
				<WithTimeDemo />
			</Example>
			<Example title="With Dropdowns (dedicated)">
				<WithDropdownsDemo />
			</Example>
			<Example title="With Dropdowns (slotted)">
				<WithSlottedPickersDemo />
			</Example>
			<Example title="Short Weekdays">
				<ShortWeekdaysDemo />
			</Example>
			<Example title="Custom Days" className="lg:col-span-2">
				<CustomDaysDemo />
			</Example>
			<Example title="Disabled">
				<DisabledDemo />
			</Example>
			<Example title="Min & Max">
				<MinMaxDemo />
			</Example>
			<Example title="Unavailable Weekends">
				<UnavailableWeekendsDemo />
			</Example>
			<Example title="Invalid">
				<InvalidDemo />
			</Example>
			<Example title="Today Indicator">
				<TodayIndicatorDemo />
			</Example>
			<Example title="International (Arabic)">
				<InternationalDemo />
			</Example>
			<Example title="Scheduler" className="lg:col-span-2">
				<SchedulerDemo />
			</Example>
		</Examples>
	);
}
