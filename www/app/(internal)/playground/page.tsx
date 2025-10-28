"use client";

import React from "react";
import { AlignLeftIcon } from "lucide-react";
import {
  ButtonContext,
  CheckboxContext,
  CheckboxGroupContext,
  Provider,
  RadioGroupContext,
  SwitchContext,
} from "react-aria-components";

import { cn } from "@dotui/registry-v2/lib/utils";
import { Label } from "@dotui/registry-v2/ui/field";
import { SkeletonProvider } from "@dotui/registry-v2/ui/skeleton";
import {
  Switch,
  SwitchIndicator,
  SwitchThumb,
} from "@dotui/registry-v2/ui/switch";

import { TableOfContents } from "@/modules/docs/components/toc";
import * as demos from "./demos";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  preview: React.ComponentType | null;
  controls?: [React.Context<any>, string[]][];
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
        preview: demos.ButtonDemo,
        controls: [[ButtonContext, ["isDisabled", "isPending"]]],
      },
      {
        id: "toggle-button",
        title: "ToggleButton",
        preview: demos.ToggleButtonDemo,
      },
      {
        id: "toggle-button-group",
        title: "ToggleButtonGroup",
        preview: demos.ToggleButtonGroupDemo,
      },
      {
        id: "file-trigger",
        title: "FileTrigger",
        preview: demos.FileTriggerDemo,
      },
      {
        id: "button-group",
        title: "ButtonGroup",
        preview: demos.ButtonGroupDemo,
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
        preview: demos.InputDemo,
      },
      {
        id: "text-area",
        title: "TextArea",
        preview: demos.TextAreaDemo,
      },
      {
        id: "input-group",
        title: "InputGroup",
        preview: demos.InputGroupDemo,
      },
      {
        id: "text-field",
        title: "TextField",
        preview: demos.TextFieldDemo,
      },
      {
        id: "search-field",
        title: "SearchField",
        preview: demos.SearchFieldDemo,
      },
      {
        id: "number-field",
        title: "NumberField",
        preview: demos.NumberFieldDemo,
      },
      // TODO
      {
        id: "checkbox",
        title: "Checkbox & CheckboxGroup",
        preview: demos.CheckboxDemo,
        controls: [
          [CheckboxGroupContext, ["isDisabled", "isInvalid"]],
          [CheckboxContext, ["isDisabled", "isInvalid"]],
        ],
      },
      // TODO
      {
        id: "radio-group",
        title: "RadioGroup",
        preview: demos.RadioGroupDemo,
        controls: [[RadioGroupContext, ["isDisabled", "isInvalid"]]],
      },
      {
        id: "switch",
        title: "Switch",
        preview: demos.SwitchDemo,
        controls: [[SwitchContext, ["isDisabled", "isReadOnly"]]],
      },
      {
        id: "slider",
        title: "Slider",
        preview: demos.SliderDemo,
      },
      {
        id: "field",
        title: "Field",
        preview: demos.FieldDemo,
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
        id: "tag-group",
        title: "TagGroup",
        preview: demos.TagGroupDemo,
      },
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
      {
        id: "color-field",
        title: "ColorField",
        preview: demos.ColorFieldDemo,
      },
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
    <div className="container max-w-screen-xl py-20 xl:grid xl:grid-cols-[1fr_250px] xl:gap-12">
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
                  controls={item.controls}
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
  controls,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  controls?: [React.Context<any>, string[]][];
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Extract unique properties from all contexts
  const uniqueProps = React.useMemo(() => {
    if (!controls) return [];
    const allProps = controls.flatMap(([_, props]) => props);
    return Array.from(new Set(allProps));
  }, [controls]);

  // Create state for each unique property
  const [controlStates, setControlStates] = React.useState<
    Record<string, boolean>
  >(() => uniqueProps.reduce((acc, prop) => ({ ...acc, [prop]: false }), {}));

  // Build provider values
  const providerValues = React.useMemo(() => {
    if (!controls) return [];
    return controls.map(([context, props]) => {
      const contextValues = props.reduce(
        (acc, prop) => ({
          ...acc,
          [prop]: controlStates[prop],
        }),
        {},
      );
      return [context, contextValues];
    }) as any;
  }, [controls, controlStates]);

  const handlePropertyToggle = (prop: string, value: boolean) => {
    setControlStates((prev) => ({ ...prev, [prop]: value }));
  };

  return (
    <div className="flex flex-col gap-2 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3
          id={id}
          className="mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight first:mt-0"
        >
          {title}
        </h3>
      </div>
      {description && <p className="text-sm text-fg-muted">{description}</p>}
      <div
        className={cn("relative rounded-lg border bg-bg p-6 pt-12", className)}
      >
        <div className="absolute top-4 right-4 flex gap-8 text-sm text-fg-muted">
          {uniqueProps.map((prop) => (
            <Switch
              key={prop}
              size="sm"
              isSelected={controlStates[prop]}
              onChange={(value) => handlePropertyToggle(prop, value)}
              className="flex-row-reverse gap-1"
            >
              <SwitchIndicator>
                <SwitchThumb />
              </SwitchIndicator>
              <Label>{prop}</Label>
            </Switch>
          ))}
          <Switch
            size="sm"
            isSelected={isLoading}
            onChange={setIsLoading}
            className="flex-row-reverse gap-1"
          >
            <SwitchIndicator>
              <SwitchThumb />
            </SwitchIndicator>
            <Label>Skeleton</Label>
          </Switch>
        </div>
        {controls ? (
          <Provider values={providerValues}>
            <SkeletonProvider isLoading={isLoading}>
              {children}
            </SkeletonProvider>
          </Provider>
        ) : (
          <SkeletonProvider isLoading={isLoading}>{children}</SkeletonProvider>
        )}
      </div>
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
