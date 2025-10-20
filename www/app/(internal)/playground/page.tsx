"use client";

import React from "react";
import { AlignLeftIcon } from "lucide-react";

import { cn } from "@dotui/registry-v2/lib/utils";
import { SkeletonProvider } from "@dotui/registry-v2/ui/skeleton";
import { Switch } from "@dotui/registry-v2/ui/switch";
import { ToggleButton } from "@dotui/registry-v2/ui/toggle-button";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { TableOfContents } from "@/modules/docs/components/toc";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import * as demos from "./demos";
import { ButtonDemo } from "./demos/button-demo";
import { ButtonGroupDemo } from "./demos/button-group-demo";
import { CheckboxDemo } from "./demos/checkbox-demo";
import { FieldDemo } from "./demos/field-demo";
import { FileTriggerDemo } from "./demos/file-trigger-demo";
import { InputDemo } from "./demos/input-demo";
import { InputGroupDemo } from "./demos/input-group-demo";
import { NumberFieldDemo } from "./demos/number-field-demo";
import { SearchFieldDemo } from "./demos/search-field-demo";
import { SliderDemo } from "./demos/slider-demo";
import { SwitchDemo } from "./demos/switch-demo";
import { TextAreaDemo } from "./demos/text-area-demo";
import { TextFieldDemo } from "./demos/text-field-demo";
import { ToggleButtonDemo } from "./demos/toggle-button-demo";
import { ToggleButtonGroupDemo } from "./demos/toggle-button-group-demo";
import { ThemeSwitcher } from "./theme-switcher";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  preview: React.ComponentType | null;
}

interface ContentSection {
  id: string;
  title: string;
  items: ContentItem[];
}

const content: ContentSection[] = [
  {
    id: "buttons",
    title: "Buttons",
    items: [
      {
        id: "button",
        title: "Button",
        preview: ButtonDemo,
      },
      {
        id: "toggle-button",
        title: "ToggleButton",
        preview: ToggleButtonDemo,
      },
      {
        id: "toggle-button-group",
        title: "ToggleButtonGroup",
        preview: ToggleButtonGroupDemo,
      },
      {
        id: "file-trigger",
        title: "FileTrigger",
        preview: FileTriggerDemo,
      },
      {
        id: "button-group",
        title: "ButtonGroup",
        preview: ButtonGroupDemo,
      },
    ],
  },

  {
    id: "inputs-controls-form",
    title: "Inputs, controls and form",
    items: [
      {
        id: "input",
        title: "Input",
        preview: InputDemo,
      },
      {
        id: "text-area",
        title: "TextArea",
        preview: TextAreaDemo,
      },
      {
        id: "input-group",
        title: "InputGroup",
        preview: InputGroupDemo,
      },
      {
        id: "text-field",
        title: "TextField",
        preview: TextFieldDemo,
      },
      {
        id: "search-field",
        title: "SearchField",
        preview: SearchFieldDemo,
      },
      {
        id: "number-field",
        title: "NumberField",
        preview: NumberFieldDemo,
      },
      // TODO
      {
        id: "checkbox",
        title: "Checkbox & CheckboxGroup",
        preview: CheckboxDemo,
      },
      // TODO
      {
        id: "radio-group",
        title: "RadioGroup",
        preview: demos.RadioGroupDemo,
      },
      // TODO
      {
        id: "switch",
        title: "Switch",
        preview: SwitchDemo,
      },
      {
        id: "slider",
        title: "Slider",
        preview: SliderDemo,
      },
      {
        id: "field",
        title: "Field",
        preview: FieldDemo,
      },
      {
        id: "form",
        title: "Form",
        preview: demos.FormDemo,
      },
    ],
  },

  {
    id: "pickers and menus",
    title: "Pickers",
    items: [
      {
        id: "menu",
        title: "Menu",
        preview: demos.MenuDemo,
      },
      {
        id: "combobox",
        title: "Combobox",
        preview: demos.ComboboxDemo,
      },
      {
        id: "select",
        title: "Select",
        preview: demos.SelectDemo,
      },
      {
        id: "autocomplete",
        title: "Autocomplete",
        preview: demos.AutocompleteDemo,
      },
    ],
  },

  {
    id: "dates",
    title: "Dates",
    items: [
      {
        id: "calendar",
        title: "Calendar",
        preview: demos.CalendarDemo,
      },
      {
        id: "date-field",
        title: "DateField",
        preview: demos.DateFieldDemo,
      },
      {
        id: "date-picker",
        title: "DatePicker",
        preview: demos.DatePickerDemo,
      },
      {
        id: "time-field",
        title: "TimeField",
        preview: demos.TimeFieldDemo,
      },
    ],
  },

  {
    id: "feedback",
    title: "Feedback",
    items: [
      {
        id: "alert",
        title: "Alert",
        preview: demos.AlertDemo,
      },
      {
        id: "progress-bar",
        title: "ProgressBar",
        preview: demos.ProgressBarDemo,
      },
      {
        id: "toast",
        title: "Toast",
        preview: demos.ToastDemo,
      },
      {
        id: "loader",
        title: "Loader",
        preview: demos.LoaderDemo,
      },
      {
        id: "skeleton",
        title: "Skeleton",
        preview: demos.SkeletonDemo,
      },
    ],
  },

  {
    id: "collections",
    title: "Collections",
    items: [
      {
        id: "list-box",
        title: "ListBox",
        preview: demos.ListBoxDemo,
      },
      {
        id: "grid-list",
        title: "GridList",
        preview: demos.GridListDemo,
      },
      {
        id: "tag-group",
        title: "TagGroup",
        preview: demos.TagGroupDemo,
      },
      // {
      //   id: "tree",
      //   title: "Tree",
      //   preview: demos.TreeDemo,
      // },
    ],
  },

  {
    id: "navigation",
    title: "Navigation",
    items: [
      {
        id: "link",
        title: "Link",
        preview: demos.LinkDemo,
      },
      {
        id: "tabs",
        title: "Tabs",
        preview: demos.TabsDemo,
      },
      {
        id: "breadcrumb",
        title: "Breadcrumb",
        preview: demos.BreadcrumbDemo,
      },
      {
        id: "pagination",
        title: "Pagination",
        preview: demos.PaginationDemo,
      },
      {
        id: "command",
        title: "Command",
        preview: demos.CommandDemo,
      },
    ],
  },

  {
    id: "data-display",
    title: "Data display",
    items: [
      {
        id: "accordion",
        title: "Accordion",
        preview: demos.AccordionDemo,
      },
      {
        id: "avatar",
        title: "Avatar",
        preview: demos.AvatarDemo,
      },
      {
        id: "kbd",
        title: "Kbd",
        preview: demos.KbdDemo,
      },
      {
        id: "badge",
        title: "Badge",
        preview: demos.BadgeDemo,
      },
      {
        id: "table",
        title: "Table",
        preview: demos.TableDemo,
      },
      {
        id: "card",
        title: "Card",
        preview: demos.CardDemo,
      },
      {
        id: "separator",
        title: "Separator",
        preview: demos.SeparatorDemo,
      },
      {
        id: "empty",
        title: "Empty",
        preview: demos.EmptyDemo,
      },
    ],
  },
  {
    id: "colors",
    title: "Colors",
    items: [
      {
        id: "color-area",
        title: "ColorArea",
        preview: demos.ColorAreaDemo,
      },
      // {
      //   id: "color-field",
      //   title: "ColorField",
      //   preview: demos.ColorFieldDemo,
      // },
      {
        id: "color-picker",
        title: "ColorPicker",
        preview: demos.ColorPickerDemo,
      },
      {
        id: "color-slider",
        title: "ColorSlider",
        preview: demos.ColorSliderDemo,
      },
      {
        id: "color-swatch-picker",
        title: "ColorSwatchPicker",
        preview: demos.ColorSwatchPickerDemo,
      },
    ],
  },
  {
    id: "overlays",
    title: "Overlays",
    items: [
      {
        id: "dialog",
        title: "Dialog (with responsive overlay)",
        description:
          "The dialog is rendered as a modal in desktop and as a drawer on mobile.",
        preview: demos.DialogDemo,
      },
      {
        id: "modal",
        title: "Modal",
        preview: demos.ModalDemo,
      },
      {
        id: "popover",
        title: "Popover",
        preview: demos.PopoverDemo,
      },
      {
        id: "drawer",
        title: "Drawer",
        preview: demos.DrawerDemo,
      },
      {
        id: "tooltip",
        title: "Tooltip",
        preview: demos.TooltipDemo,
      },
    ],
  },
];

// Transform content to fumadocs TOC format
const toc = content.flatMap((section) => [
  {
    title: section.title,
    url: `#${section.id}`,
    depth: 2,
  },
  ...section.items.map((item) => ({
    title: item.title,
    url: `#${item.id}`,
    depth: 3,
  })),
]);

export default function InternalPage() {
  return (
    <div className="container max-w-screen-xl py-20 pb-200 xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold lg:text-4xl">Playground</h1>
            <p className="text-fg-muted">
              Internal page for testing the components.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <ActiveStyleSelector className="w-44" /> */}
            {/* <ThemeSwitcher /> */}
          </div>
        </div>
        <div className="space-y-8">
          {content.map((section) => (
            <Group key={section.id} id={section.id} title={section.title}>
              {section.items.map((item) => (
                <Section
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                >
                  {item.preview ? (
                    <item.preview />
                  ) : (
                    <div>Preview not found</div>
                  )}
                </Section>
              ))}
            </Group>
          ))}
        </div>
      </div>
      <div className="max-xl:hidden">
        <div className="sticky top-6 h-[calc(100svh-calc(var(--spacing)*20))]">
          <div className="mb-3 -ml-1.5 flex items-center gap-2">
            <AlignLeftIcon className="size-4 text-fg-muted" />
            <p className="text-sm text-fg-muted">On this page</p>
          </div>
          <TableOfContents toc={toc} />
        </div>
      </div>
    </div>
  );
}

const Section = ({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div className="flex flex-col gap-2 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3
          id={id}
          className="mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight first:mt-0"
        > 
          {title}
        </h3>
        <Switch isSelected={isLoading} onChange={setIsLoading}>
          isLoading
        </Switch>
      </div>
      {description && <p className="text-sm text-fg-muted">{description}</p>}
      <SkeletonProvider isLoading={isLoading}>
        <div className={cn("rounded-lg border bg-bg p-6", className)}>
          {children}
        </div>
      </SkeletonProvider>
    </div>
  );
};

const Group = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2
        id={id}
        className="mt-12 scroll-m-20 border-b pb-2 font-heading text-2xl font-semibold tracking-tight first:mt-0"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-8">{children}</div>
    </div>
  );
};
