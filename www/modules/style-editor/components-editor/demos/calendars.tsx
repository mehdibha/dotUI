import { parseDate } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";

import { Section } from "@/modules/style-editor/components-editor/component-config-section";
import { getComponentVariants } from "@/modules/style-editor/components-editor/demos/utils";

export function Calendars() {
  return (
    <Section
      name="calendars"
      title="Calendars"
      variants={getComponentVariants("calendar")}
    >
      <Calendar defaultValue={parseDate("2020-02-03")} />
      {/* RangeCalendar not available */}
    </Section>
  );
}
