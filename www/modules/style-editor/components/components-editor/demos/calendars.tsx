import { parseDate } from "@internationalized/date";

import { Calendar, RangeCalendar } from "@dotui/registry/ui/calendar";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Calendars() {
  return (
    <Section
      name="calendars"
      title="Calendars"
      variants={getComponentVariants("calendar")}
    >
      <Calendar defaultValue={parseDate("2020-02-03")} />
      <RangeCalendar
        defaultValue={{
          start: parseDate("2020-02-03"),
          end: parseDate("2020-02-12"),
        }}
      />
    </Section>
  );
}
