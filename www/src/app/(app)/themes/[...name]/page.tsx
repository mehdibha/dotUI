"use client";

import React from "react";
import {
  ArrowLeftIcon,
  CheckIcon,
  MoonIcon,
  PenIcon,
  SaveIcon,
  SunIcon,
} from "lucide-react";
import { AnimatePresence, motion, Transition } from "motion/react";
import { Link } from "next-view-transitions";
import { useMeasure } from "react-use";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
import { Tabs, Tab, TabList } from "@/components/core/tabs";
import { ToggleButton } from "@/components/core/toggle-button";
import { Tooltip } from "@/components/core/tooltip";
import { ButtonDemo } from "@/modules/themes/components/demos/button-demo";
import { CalendarDemo } from "@/modules/themes/components/demos/calendar-demo";
import { CheckboxDemo } from "@/modules/themes/components/demos/checkbox-demo";
import { ComboboxDemo } from "@/modules/themes/components/demos/combobox-demo";
import { CommandDemo } from "@/modules/themes/components/demos/command-demo";
import { DatePickerDemo } from "@/modules/themes/components/demos/date-picker-demo";
import { DateRangePickerDemo } from "@/modules/themes/components/demos/date-range-picker-demo";
import { IconsDemo } from "@/modules/themes/components/demos/icons-demo";
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

export default function ThemePage() {
  const [isEditMode, setEditMode] = React.useState(false);

  return (
    <div className="pb-20 pt-10">
      <Link
        href="/themes"
        className="text-fg-muted hover:text-fg flex cursor-pointer items-center gap-1 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        <span>
          <span className="[view-transition-name:themes-title]">themes</span>
        </span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">Forest</h2>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isEditMode && (
              <motion.div
                initial={{ width: 60, opacity: 0 }}
                animate={{ width: 112, opacity: 1 }}
                exit={{ width: 60, opacity: 0 }}
                transition={TRANSITION}
                className="overflow-hidden"
              >
                <Button
                  prefix={<SaveIcon />}
                  isDisabled
                  className="w-full min-w-0"
                >
                  Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Tooltip content="Edit mode" variant="inverse" showArrow>
            <ToggleButton
              isSelected={isEditMode}
              onChange={setEditMode}
              prefix={<PenIcon />}
              variant="primary"
              shape="rectangle"
            >
              Edit mode
            </ToggleButton>
          </Tooltip>
        </div>
      </div>
      <div className="mt-12 space-y-10">
        <Section
          title="Colors"
          description="Learn how to work with color system."
          action={
            <Tabs variant="solid">
              <TabList className="[&_svg]:size-4">
                <Tab id="light">
                  <SunIcon />
                </Tab>
                <Tab id="dark">
                  <MoonIcon />
                </Tab>
              </TabList>
            </Tabs>
          }
          className="pt-4"
        >
          {/* {isEditMode ? (
            <Container key="edit">
              <p>edit colors here</p>
            </Container>
          ) : (
            <Container key="view">
              
            </Container>
          )} */}
          <p className="font-medium tracking-tight">Core colors</p>
          <div className="mt-1 flex gap-1">
            <Item
              className="bg-bg-neutral rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
            <Item
              className="bg-bg-accent rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
          </div>
          <div className="mt-1 space-y-1">
            {[
              { name: "neutral", label: "Neutral" },
              { name: "accent", label: "Accent" },
            ].map((shade) => (
              <div key={shade.name} className="flex items-center gap-2">
                <p className="text-fg-muted w-[60px] text-sm">{shade.label}</p>
                <div className="flex flex-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Item
                      key={i}
                      style={{
                        backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                      }}
                      className="h-8 rounded-sm"
                      containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-medium tracking-tight">Semantic colors</p>
          <div className="mt-1 flex gap-1">
            {/* <Item className="bg-bg-info" /> */}
            <Item
              className="bg-bg-success rounded-sm"
              containerClassName="ml-0! mr-0!"
            />
            <Item
              className="bg-bg-warning rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
            <Item
              className="bg-bg-danger rounded-sm"
              containerClassName=" ml-0! mr-0!"
            />
          </div>
          <div className="mt-1 space-y-1">
            {[
              { name: "success", label: "Success" },
              { name: "warning", label: "Warning" },
              { name: "danger", label: "Danger" },
              // { name: "info", label: "Info" },
            ].map((shade) => (
              <div key={shade.name} className="flex items-center gap-2">
                <p className="text-fg-muted w-[60px] text-sm">{shade.label}</p>
                <div className="flex flex-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Item
                      key={i}
                      style={{
                        backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                      }}
                      className="h-8 rounded-sm"
                      containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section
          title="Typography"
          description="Rules of typesetting throughout the system."
          className="pt-4"
        >
          <div className="font-heading space-y-1 font-bold tracking-tight">
            <p className="text-5xl">Heading 5XL</p>
            <p className="text-4xl">Heading 4XL</p>
            <p className="text-3xl">Heading 3XL</p>
            <p className="text-2xl">Heading 2XL</p>
            <p className="text-xl">Heading XL</p>
            <p className="text-lg">Heading LG</p>
          </div>
          <div className="font-body mt-4 space-y-0.5 tracking-tight">
            <p className="text-xl">This is body content XL</p>
            <p className="text-lg">This is body content LG</p>
            <p className="text-base">This is body content base</p>
            <p className="text-sm">This is body content sm</p>
          </div>
        </Section>
        <Section
          title="Iconography"
          description="A collection of icons."
          className="pt-4"
        >
          <IconsDemo />
        </Section>
        <Section
          title="Components overview"
          description="Components are the reusable primitives for creating user interfaces."
          className="space-y-4 pt-4"
        >
          {/* Buttons */}
          <ComponentSection title="Button">
            <ButtonDemo />
          </ComponentSection>
          <ComponentSection title="Toggle Button">
            <ToggleButtonDemo />
          </ComponentSection>
          {/* Inputs */}
          <ComponentSection title="TextField">
            <TextFieldDemo />
          </ComponentSection>
          <ComponentSection title="TextArea">
            <TextAreaDemo />
          </ComponentSection>
          <ComponentSection title="SearchField">
            <SearchFieldDemo />
          </ComponentSection>
          <ComponentSection title="NumberField">
            <NumberFieldDemo />
          </ComponentSection>
          <ComponentSection title="Checkbox">
            <CheckboxDemo />
          </ComponentSection>
          <ComponentSection title="Checkbox Group"></ComponentSection>
          <ComponentSection title="Radio Group">
            <RadioGroupDemo />
          </ComponentSection>
          <ComponentSection title="Switch">
            <SwitchDemo />
          </ComponentSection>
          <ComponentSection title="Slider">
            <SliderDemo />
          </ComponentSection>
          {/* Menus and selection */}
          <ComponentSection title="ListBox">
            <ListBoxDemo />
          </ComponentSection>
          <ComponentSection title="Menu">
            <MenuDemo />
          </ComponentSection>
          <ComponentSection title="Select">
            <SelectDemo />
          </ComponentSection>
          <ComponentSection title="Combobox">
            <ComboboxDemo />
          </ComponentSection>
          <ComponentSection title="Tag Group">
            <TagGroupDemo />
          </ComponentSection>
          <ComponentSection title="Command">
            <CommandDemo />
          </ComponentSection>
          {/* Date and time */}
          <ComponentSection title="Calendar">
            <CalendarDemo />
          </ComponentSection>
          <ComponentSection title="DatePicker">
            <DatePickerDemo />
          </ComponentSection>
          <ComponentSection title="DateRangePicker">
            <DateRangePickerDemo />
          </ComponentSection>
        </Section>
      </div>
    </div>
  );
}

const ComponentSection = ({
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
    <div className="overflow-hidden rounded-sm border">
      <div className="bg-bg-muted/50 flex items-center justify-between gap-2 border-b px-4 py-2">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

const Section = ({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  return (
    <section>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <motion.div animate={{ height }} transition={TRANSITION}>
        <div ref={ref}>
          <div className={className}>{children}</div>
        </div>
      </motion.div>
    </section>
  );
};

// const Container = ({
//   children,
//   className,
// }: {
//   children?: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <motion.div
//       initial={false}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       transition={TRANSITION}
//       className={className}
//     >
//       {children}
//     </motion.div>
//   );
// };

const Item = ({
  containerClassName,
  className,
  style,
}: {
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [isCopied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("#000000");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
        containerClassName
      )}
    >
      <div
        className={cn(
          "hover:h-22 duration-250 group absolute bottom-0 left-0 h-12 w-full cursor-pointer overflow-hidden rounded-t-2xl transition-[height]",
          className
        )}
        style={style}
      >
        <div
          className={cn(
            "flex items-center justify-between p-2 text-sm opacity-0 transition-opacity group-hover:opacity-100",
            isCopied && "opacity-0!"
          )}
        >
          <p>Danger</p>
          <p>#ff0000</p>
        </div>
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
            isCopied && "opacity-100"
          )}
        >
          <CheckIcon className="text-fg-muted size-4" />
        </div>
      </div>
    </button>
  );
};
