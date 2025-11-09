import type { Route } from "next";
import Link from "next/link";
import { AlignLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { TableOfContents } from "@/modules/docs/components/toc";

export default function Page() {
  return (
    <div className="relative container xl:grid xl:grid-cols-[1fr_150px] xl:gap-12">
      <div className="space-y-12">
        {data.map((category) => (
          <div key={category.title}>
            <h2 className="text-2xl font-medium">{category.title}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {category.components.map((component) => (
                <ComponentCard key={component.name} {...component} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-xl:hidden">
        <div className="sticky top-20 h-[calc(100svh-calc(var(--spacing)*20))]">
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

interface ComponentCardProps {
  name: string;
  href: string;
  preview: string;
  scale?: number;
}

function ComponentCard({
  name,
  href,
  preview,
  scale = 0.8,
}: ComponentCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-32 border rounded-lg overflow-hidden bg-muted">
        <iframe
          src={preview}
          className="origin-top-left"
          sandbox="allow-scripts allow-same-origin"
          style={{
            transform: `scale(${scale})`,
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
          }}
          tabIndex={-1}
        />
      </div>
      <Button asChild size="lg" variant="link">
        <Link href={href as Route}>{name}</Link>
      </Button>
    </div>
  );
}

const data = [
  {
    title: "Buttons",
    components: [
      {
        name: "Button",
        href: "/docs/components/button",
        preview: "/demos/button",
        scale: 1,
      },
      {
        name: "ToggleButton",
        href: "/docs/components/toggle-button",
        preview: "/demos/toggle-button",
        scale: 1,
      },
      {
        name: "ToggleButtonGroup",
        href: "/docs/components/toggle-button-group",
        preview: "/demos/toggle-button-group",
        scale: 1,
      },
      {
        name: "FileTrigger",
        href: "/docs/components/file-trigger",
        preview: "/demos/file-trigger",
        scale: 1,
      },
      {
        name: "Group",
        href: "/docs/components/group",
        preview: "/demos/group",
        scale: 1,
      },
    ],
  },
  {
    title: "Inputs, controls and form",
    components: [
      {
        name: "Input",
        href: "/docs/components/input",
        preview: "/demos/input",
      },
      {
        name: "TextArea",
        href: "/docs/components/text-area",
        preview: "/demos/text-area",
      },
      {
        name: "InputGroup",
        href: "/docs/components/input-group",
        preview: "/demos/input-group",
      },
      {
        name: "TextField",
        href: "/docs/components/text-field",
        preview: "/demos/text-field",
      },
      {
        name: "SearchField",
        href: "/docs/components/search-field",
        preview: "/demos/search-field",
      },
      // {
      //   name: "NumberField",
      //   href: "/docs/components/number-field",
      //   preview: "/demos/number-field",
      // },
      // {
      //   name: "Checkbox",
      //   href: "/docs/components/checkbox",
      //   preview: "/demos/checkbox",
      // },
      // {
      //   name: "RadioGroup",
      //   href: "/docs/components/radio-group",
      //   preview: "/demos/radio-group",
      // },
      // {
      //   name: "Switch",
      //   href: "/docs/components/switch",
      //   preview: "/demos/switch",
      // },
      // {
      //   name: "Slider",
      //   href: "/docs/components/slider",
      //   preview: "/demos/slider",
      // },
      // {
      //   name: "Field",
      //   href: "/docs/components/field",
      //   preview: "/demos/field",
      // },
      // {
      //   name: "Form",
      //   href: "/docs/components/form",
      //   preview: "/demos/form",
      // },
    ],
  },
  {
    title: "Pickers",
    components: [
      {
        name: "Menu",
        href: "/docs/components/menu",
        preview: "/demos/menu",
      },
      {
        name: "Combobox",
        href: "/docs/components/combobox",
        preview: "/demos/combobox",
        scale: 0.7,
      },
      {
        name: "Select",
        href: "/docs/components/select",
        preview: "/demos/select",
      },
    ],
  },
  {
    title: "Dates",
    components: [
      {
        name: "Calendar",
        href: "/docs/components/calendar",
        preview: "/demos/calendar",
        scale: 0.6,
      },
      {
        name: "DateField",
        href: "/docs/components/date-field",
        preview: "/demos/date-field",
      },
      {
        name: "DatePicker",
        href: "/docs/components/date-picker",
        preview: "/demos/date-picker",
        scale: 0.5,
      },
      {
        name: "TimeField",
        href: "/docs/components/time-field",
        preview: "/demos/time-field",
      },
    ],
  },
  {
    title: "Feedback",
    components: [
      {
        name: "Alert",
        href: "/docs/components/alert",
        preview: "/demos/alert",
      },
      {
        name: "ProgressBar",
        href: "/docs/components/progress-bar",
        preview: "/demos/progress-bar",
      },
      {
        name: "Toast",
        href: "/docs/components/toast",
        preview: "/demos/toast",
        scale: 0.6,
      },
      {
        name: "Loader",
        href: "/docs/components/loader",
        preview: "/demos/loader",
        scale: 1,
      },
      {
        name: "Skeleton",
        href: "/docs/components/skeleton",
        preview: "/demos/skeleton",
      },
    ],
  },
  {
    title: "Collections",
    components: [
      {
        name: "ListBox",
        href: "/docs/components/list-box",
        preview: "/demos/list-box",
      },
      {
        name: "TagGroup",
        href: "/docs/components/tag-group",
        preview: "/demos/tag-group",
      },
    ],
  },
  {
    title: "Navigation",
    components: [
      {
        name: "Link",
        href: "/docs/components/link",
        preview: "/demos/link",
        scale: 1,
      },
      {
        name: "Tabs",
        href: "/docs/components/tabs",
        preview: "/demos/tabs",
      },
      {
        name: "Breadcrumbs",
        href: "/docs/components/breadcrumbs",
        preview: "/demos/breadcrumbs",
      },
      {
        name: "Command",
        href: "/docs/components/command",
        preview: "/demos/command",
      },
    ],
  },
  {
    title: "Data display",
    components: [
      {
        name: "Accordion",
        href: "/docs/components/accordion",
        preview: "/demos/accordion",
        scale: 0.7,
      },
      {
        name: "Avatar",
        href: "/docs/components/avatar",
        preview: "/demos/avatar",
      },
      {
        name: "Kbd",
        href: "/docs/components/kbd",
        preview: "/demos/kbd",
        scale: 1,
      },
      {
        name: "Badge",
        href: "/docs/components/badge",
        preview: "/demos/badge",
      },
      {
        name: "Table",
        href: "/docs/components/table",
        preview: "/demos/table",
      },
      {
        name: "Card",
        href: "/docs/components/card",
        preview: "/demos/card",
        scale: 0.5,
      },
      {
        name: "Separator",
        href: "/docs/components/separator",
        preview: "/demos/separator",
      },
      {
        name: "Empty",
        href: "/docs/components/empty",
        preview: "/demos/empty",
        scale: 0.7,
      },
    ],
  },
  {
    title: "Colors",
    components: [
      {
        name: "ColorArea",
        href: "/docs/components/color-area",
        preview: "/demos/color-area",
      },
      {
        name: "ColorField",
        href: "/docs/components/color-field",
        preview: "/demos/color-field",
      },
      {
        name: "ColorPicker",
        href: "/docs/components/color-picker",
        preview: "/demos/color-picker",
        scale: 0.7,
      },
      {
        name: "ColorSlider",
        href: "/docs/components/color-slider",
        preview: "/demos/color-slider",
      },
      {
        name: "ColorSwatchPicker",
        href: "/docs/components/color-swatch-picker",
        preview: "/demos/color-swatch-picker",
      },
    ],
  },
  {
    title: "Overlays",
    components: [
      {
        name: "Dialog",
        href: "/docs/components/dialog",
        preview: "/demos/dialog",
      },
      {
        name: "Modal",
        href: "/docs/components/modal",
        preview: "/demos/modal",
        scale: 0.6,
      },
      {
        name: "Popover",
        href: "/docs/components/popover",
        preview: "/demos/popover",
      },
      {
        name: "Drawer",
        href: "/docs/components/drawer",
        preview: "/demos/drawer",
      },
      {
        name: "Tooltip",
        href: "/docs/components/tooltip",
        preview: "/demos/tooltip",
      },
    ],
  },
];

const toc = data.map((category) => ({
  title: category.title,
  url: `#${category.title}`,
  depth: 2,
}));
