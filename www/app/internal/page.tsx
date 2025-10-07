import { AlignLeftIcon } from "lucide-react";

import { cn } from "@dotui/registry-v2/lib/utils";

import { TableOfContents } from "@/modules/docs/components/toc";
import { AccordionDemo } from "./accordion-demo";
import { AlertDemo } from "./alert-demo";
import { AvatarDemo } from "./avatar-demo";
import { BadgeDemo } from "./badge-demo";
import { ButtonDemo } from "./button-demo";
import { ButtonGroupDemo } from "./button-group-demo";
import { CalendarDemo } from "./calendar-demo";
import { CardDemo } from "./card-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { ComboboxDemo } from "./combobox-demo";

interface ContentItem {
  id: string;
  title: string;
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
        preview: null,
      },
      {
        id: "toggle-button-group",
        title: "ToggleButtonGroup",
        preview: null,
      },
      {
        id: "file-trigger",
        title: "FileTrigger",
        preview: null,
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
        id: "text-area",
        title: "TextArea",
        preview: null,
      },
      {
        id: "text-field",
        title: "TextField",
        preview: null,
      },
      {
        id: "search-field",
        title: "SearchField",
        preview: null,
      },
      {
        id: "number-field",
        title: "NumberField",
        preview: null,
      },
      {
        id: "checkbox",
        title: "Checkbox & CheckboxGroup",
        preview: CheckboxDemo,
      },
      {
        id: "radio-group",
        title: "RadioGroup",
        preview: null,
      },
      {
        id: "switch",
        title: "Switch",
        preview: null,
      },
      {
        id: "slider",
        title: "Slider",
        preview: null,
      },
      {
        id: "field",
        title: "Field",
        preview: null,
      },
      {
        id: "form",
        title: "Form",
        preview: null,
      },
    ],
  },
  {
    id: "pickers",
    title: "Pickers",
    items: [
      {
        id: "combobox",
        title: "Combobox",
        preview: ComboboxDemo,
      },
      {
        id: "select",
        title: "Select",
        preview: null,
      },
      {
        id: "autocomplete",
        title: "Autocomplete",
        preview: null,
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
        preview: CalendarDemo,
      },
      {
        id: "date-field",
        title: "DateField",
        preview: null,
      },
      {
        id: "date-picker",
        title: "DatePicker",
        preview: null,
      },
      {
        id: "time-field",
        title: "TimeField",
        preview: null,
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
        preview: AlertDemo,
      },
      {
        id: "progress-bar",
        title: "ProgressBar",
        preview: null,
      },
      {
        id: "toast",
        title: "Toast",
        preview: null,
      },
      {
        id: "loader",
        title: "Loader",
        preview: null,
      },
      {
        id: "skeleton",
        title: "Skeleton",
        preview: null,
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
        preview: null,
      },
      {
        id: "grid-list",
        title: "GridList",
        preview: null,
      },
      {
        id: "tag-group",
        title: "TagGroup",
        preview: null,
      },
      {
        id: "tree",
        title: "Tree",
        preview: null,
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
        preview: null,
      },
      {
        id: "tabs",
        title: "Tabs",
        preview: null,
      },
      {
        id: "breadcrumb",
        title: "Breadcrumb",
        preview: null,
      },
      {
        id: "pagination",
        title: "Pagination",
        preview: null,
      },
      {
        id: "command",
        title: "Command",
        preview: null,
      },
    ],
  },
  {
    id: "overlays",
    title: "Overlays",
    items: [
      {
        id: "dialog",
        title: "Dialog",
        preview: null,
      },
      {
        id: "drawer",
        title: "Drawer",
        preview: null,
      },
      {
        id: "menu",
        title: "Menu",
        preview: null,
      },
      {
        id: "modal",
        title: "Modal",
        preview: null,
      },
      {
        id: "popover",
        title: "Popover",
        preview: null,
      },
      {
        id: "tooltip",
        title: "Tooltip",
        preview: null,
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
        preview: AccordionDemo,
      },
      {
        id: "avatar",
        title: "Avatar",
        preview: AvatarDemo,
      },
      {
        id: "kbd",
        title: "Kbd",
        preview: null,
      },
      {
        id: "badge",
        title: "Badge",
        preview: BadgeDemo,
      },
      {
        id: "table",
        title: "Table",
        preview: null,
      },
      {
        id: "card",
        title: "Card",
        preview: CardDemo,
      },
      {
        id: "separator",
        title: "Separator",
        preview: null,
      },
      {
        id: "empty",
        title: "Empty",
        preview: null,
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
        preview: null,
      },
      {
        id: "color-field",
        title: "ColorField",
        preview: null,
      },
      {
        id: "color-picker",
        title: "ColorPicker",
        preview: null,
      },
      {
        id: "color-slider",
        title: "ColorSlider",
        preview: null,
      },
      {
        id: "color-swatch-picker",
        title: "ColorSwatchPicker",
        preview: null,
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
    <div className="container grid max-w-screen-2xl grid-cols-[1fr_250px] gap-12 py-10">
      <div className="space-y-12">
        {content.map((section) => (
          <Group key={section.id} id={section.id} title={section.title}>
            {section.items.map((item) => (
              <Section key={item.id} id={item.id} title={item.title}>
                {item.preview ? (
                  <item.preview />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Working on it...
                  </div>
                )}
              </Section>
            ))}
          </Group>
        ))}
      </div>
      <div className="max-xl:hidden">
        <div className="sticky top-10 h-[calc(100svh-calc(var(--spacing)*20))]">
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
  children,
  className,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div id={id} className="flex scroll-mt-24 flex-col gap-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className={cn("space-y-4 rounded-lg border bg-bg p-6", className)}>
        {children}
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
    <div id={id} className="flex scroll-mt-20 flex-col gap-2">
      <h2 className="w-full border-b pb-2 text-3xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
};
