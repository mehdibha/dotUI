import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/core/button";
import { Label } from "@/components/core/field";
import { ListBox } from "@/components/core/list-box";
import { Popover } from "@/components/core/popover";
import { SelectRoot, SelectItem, SelectValue } from "@/components/core/select";
import { ButtonDemo } from "@/modules/themes/components/demos/button-demo";
import { CalendarDemo } from "@/modules/themes/components/demos/calendar-demo";
import { CheckboxDemo } from "@/modules/themes/components/demos/checkbox-demo";
import { ComboboxDemo } from "@/modules/themes/components/demos/combobox-demo";
import { CommandDemo } from "@/modules/themes/components/demos/command-demo";
import { DatePickerDemo } from "@/modules/themes/components/demos/date-picker-demo";
import { DateRangePickerDemo } from "@/modules/themes/components/demos/date-range-picker-demo";
import { ListBoxDemo } from "@/modules/themes/components/demos/listbox-demo";
import { MenuDemo } from "@/modules/themes/components/demos/menu-demo";
import { NumberFieldDemo } from "@/modules/themes/components/demos/number-field-demo";
import { RadioGroupDemo } from "@/modules/themes/components/demos/radio-group-demo";
import { SearchFieldDemo } from "@/modules/themes/components/demos/search-field-demo";
import { SelectDemo } from "@/modules/themes/components/demos/select-demo";
import { SliderDemo } from "@/modules/themes/components/demos/slider-demo";
import { SwitchDemo } from "@/modules/themes/components/demos/switch-demo";
import { TagGroupDemo } from "@/modules/themes/components/demos/tag-group-demo";
import { TextAreaDemo } from "@/modules/themes/components/demos/text-area-demo";
import { TextFieldDemo } from "@/modules/themes/components/demos/text-field-demo";
import { ToggleButtonDemo } from "@/modules/themes/components/demos/toggle-button-demo";

export function ThemeComponents() {
  return (
    <div className="space-y-4">
      {/* Buttons */}
      <Section title="Button">
        <ButtonDemo />
      </Section>
      <Section title="Toggle Button">
        <ToggleButtonDemo />
      </Section>
      {/* Inputs */}
      <Section title="TextField">
        <TextFieldDemo />
      </Section>
      <Section title="TextArea">
        <TextAreaDemo />
      </Section>
      <Section title="SearchField">
        <SearchFieldDemo />
      </Section>
      <Section title="NumberField">
        <NumberFieldDemo />
      </Section>
      <Section title="Checkbox">
        <CheckboxDemo />
      </Section>
      <Section title="Checkbox Group"></Section>
      <Section title="Radio Group">
        <RadioGroupDemo />
      </Section>
      <Section title="Switch">
        <SwitchDemo />
      </Section>
      <Section title="Slider">
        <SliderDemo />
      </Section>
      {/* Menus and selection */}
      <Section title="ListBox">
        <ListBoxDemo />
      </Section>
      <Section title="Menu">
        <MenuDemo />
      </Section>
      <Section title="Select">
        <SelectDemo />
      </Section>
      <Section title="Combobox">
        <ComboboxDemo />
      </Section>
      <Section title="Tag Group">
        <TagGroupDemo />
      </Section>
      <Section title="Command">
        <CommandDemo />
      </Section>
      {/* Date and time */}
      <Section title="Calendar">
        <CalendarDemo />
      </Section>
      <Section title="DatePicker">
        <DatePickerDemo />
      </Section>
      <Section title="DateRangePicker">
        <DateRangePickerDemo />
      </Section>
    </div>
  );
}

const Section = ({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className="rounded-sm border">
      <div className="bg-bg-muted/50 flex items-center justify-between gap-2 border-b p-2 pl-4">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
        <SelectRoot
          defaultSelectedKey="basic"
          className="flex w-auto flex-row items-center"
        >
          <Label>style:</Label>
          <Button
            variant="outline"
            suffix={<ChevronDownIcon />}
            size="sm"
            className="bg-bg-inverse/5"
          >
            <SelectValue />
          </Button>
          <Popover>
            <ListBox>
              <SelectItem id="basic">basic</SelectItem>
            </ListBox>
          </Popover>
        </SelectRoot>
      </div>
      <div className="max-w-lg overflow-hidden p-4">{children}</div>
    </div>
  );
};
