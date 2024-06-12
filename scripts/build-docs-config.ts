import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";
import type { DocsConfig } from "@/types/docs";
import { getDocs } from "@/server/docs";

const getCategoryDocs = (category: string) => {
  return getDocs(category).map((category) => ({
    title: category.title,
    href: category.href,
    label: category.label,
    disabled: category.disabled,
  }));
};

const docsConfig: DocsConfig = {
  nav: [
    {
      title: "Getting Started",
      slug: "docs",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
        },
        {
          title: "Design",
          items: [
            {
              title: "Overview",
              href: "/docs/design/overview",
            },
            {
              title: "Colors",
              href: "/docs/design/colors",
            },
            {
              title: "Tokens",
              href: "/docs/design/tokens",
            },
          ],
        },
      ],
    },
    {
      title: "Components",
      slug: "components",
      items: [
        {
          title: "Overview",
          href: "/components",
        },
        {
          title: "Buttons",
          items: [
            { title: "Button", href: "/components/buttons/button", label: "Done" },
            {
              title: "Toggle Button",
              href: "/components/buttons/toggle-button",
              label: "Done",
            },
            {
              title: "File Trigger",
              href: "/components/buttons/file-trigger",
              label: "Done",
            },
          ],
        },
        {
          title: "Inputs",
          items: [
            { title: "Field", href: "/components/inputs/field" },
            { title: "TextField", href: "/components/inputs/text-field", label: "Done" },
            { title: "TextArea", href: "/components/inputs/text-area", label: "Done" },
            {
              title: "SearchField",
              href: "/components/inputs/search-field",
              label: "Done",
            },
            {
              title: "NumberField",
              href: "/components/inputs/number-field",
              label: "Done",
            },
            { title: "Checkbox", href: "/components/inputs/checkbox", label: "Done" },
            {
              title: "Checkbox Card",
              href: "/components/inputs/checkbox-card",
              label: "Done",
            },
            {
              title: "Checkbox Group",
              href: "/components/inputs/checkbox-group",
              label: "Done",
            },
            { title: "Radio", href: "/components/inputs/radio", label: "Done" },
            { title: "Radio Card", href: "/components/inputs/radio-card", label: "Done" },
            {
              title: "Radio Group",
              href: "/components/inputs/radio-group",
              label: "Done",
            },
            { title: "Switch", href: "/components/inputs/switch", label: "Done" },
            { title: "Slider", href: "/components/inputs/slider" },
            { title: "Form", href: "/components/inputs/form" },
          ],
        },
        {
          title: "Collections",
          items: [{ title: "Menu", href: "/components/collections/menu", label: "Done" }],
        },
        {
          title: "Selection",
          items: [
            { title: "Combobox", href: "/components/selection/combobox" },
            { title: "Select", href: "/components/selection/select" },
          ],
        },
        {
          title: "Dates",
          items: [
            { title: "Calendar", href: "/components/dates/calendar", label: "Done" },
            {
              title: "Range Calendar",
              href: "/components/dates/range-calendar",
              label: "Done",
            },
            { title: "Time Field", href: "/components/dates/time-field", label: "Done" },
            { title: "Date Field", href: "/components/dates/date-field", label: "Done" },
            { title: "Date Picker", href: "/components/dates/date-picker" },
            { title: "Date Range Picker", href: "/components/dates/date-range-picker" },
          ],
        },
        {
          title: "Colors",
          items: [
            { title: "Color Area", href: "/components/colors/color-area", label: "Done" },
            {
              title: "Color Field",
              href: "/components/colors/color-field",
              label: "Done",
            },
            {
              title: "Color Slider",
              href: "/components/colors/color-slider",
              label: "Done",
            },
            {
              title: "Color Swatch",
              href: "/components/colors/color-swatch",
              label: "Done",
            },
            {
              title: "Color Picker",
              href: "/components/colors/color-picker",
              label: "Done",
            },
          ],
        },
        {
          title: "Drag and drop",
          items: getCategoryDocs("components/drag-and-drop"),
        },
        {
          title: "Feedback",
          items: getCategoryDocs("components/feedback"),
        },
        {
          title: "Layout",
          items: getCategoryDocs("components/layout"),
        },
        {
          title: "Data display",
          items: [
            { title: "Avatar", href: "/components/data-display/avatar" },
            { title: "Badge", href: "/components/data-display/badge" },
            { title: "Card", href: "/components/data-display/card" },
            { title: "Carousel", href: "/components/data-display/carousel" },
            { title: "Separator", href: "/components/data-display/separator" },
            { title: "Table", href: "/components/data-display/table" },
          ],
        },
        {
          title: "Navigation",
          items: [
            { title: "Link", href: "/components/navigation/link" },
            { title: "Tabs", href: "/components/navigation/tabs" },
            { title: "Breadcrumbs", href: "/components/navigation/breadcrumbs" },
          ],
        },
        {
          title: "Overlay",
          items: [
            { title: "Overlay", href: "/components/overlay/overlay" },
            { title: "Dialog", href: "/components/overlay/dialog" },
            { title: "Alert Dialog", href: "/components/overlay/alert-dialog" },
            { title: "Drawer", href: "/components/overlay/drawer" },
            { title: "Popover", href: "/components/overlay/popover" },
            { title: "Tooltip", href: "/components/overlay/tooltip", label: "Done" },
          ],
        },
        {
          title: "Utils",
          items: getCategoryDocs("components/utils"),
        },
      ],
    },
    {
      title: "Hooks",
      slug: "hooks",
      items: [
        {
          title: "Overview",
          href: "/hooks",
        },
        {
          title: "Browser",
          items: getCategoryDocs("hooks/browser"),
        },
        {
          title: "Elements",
          items: getCategoryDocs("hooks/elements"),
        },
        {
          title: "Sensors",
          items: getCategoryDocs("hooks/sensors"),
        },
        {
          title: "State",
          items: getCategoryDocs("hooks/state"),
        },
        {
          title: "Utilities",
          items: getCategoryDocs("hooks/utils"),
        },
      ],
    },
  ],
};

const index = `
// This file is autogenerated by scripts/build-preview-imports.ts
// Do not edit this file directly.
import type { DocsConfig } from "@/types/docs";

export const docsConfig: DocsConfig = ${JSON.stringify(docsConfig)};
`;

rimraf.sync(path.join(process.cwd(), "src", "config", "docs-config.ts"));
fs.writeFileSync(path.join(process.cwd(), "src", "config", "docs-config.ts"), index);

console.log("\x1b[32m✓\x1b[0m Created docs-config file.");
