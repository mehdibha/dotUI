import { Calendar } from "@dotui/registry/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Pickers() {
  return (
    <Section
      name="pickers"
      title="Pickers"
      variants={getComponentVariants("combobox")}
      previewClassName="flex flex-col gap-2 *:w-64 justify-center"
    >
      <Combobox aria-label="country" form="none">
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Spain</ComboboxItem>
          <ComboboxItem>Tunisia</ComboboxItem>
          <ComboboxItem>United states</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
        </ComboboxContent>
      </Combobox>
      <DatePicker aria-label="Basic date picker" form="none">
        <DatePickerInput />
        <DatePickerContent>
          <Calendar aria-label="Pick a date" />
        </DatePickerContent>
      </DatePicker>
    </Section>
  );
}
