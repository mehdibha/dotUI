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
            { title: "Button", href: "/components/buttons/button" },
            { title: "Button Group", href: "/components/buttons/button-group" },
            { title: "Toggle Button", href: "/components/buttons/toggle-button" },
            { title: "Toggle Group", href: "/components/buttons/toggle-group" },
            { title: "File Trigger", href: "/components/buttons/file-trigger" },
          ],
        },
        {
          title: "Selection",
          items: getCategoryDocs("components/selection"),
        },
        {
          title: "Inputs",
          items: [
            { title: "Field", href: "/components/inputs/field" },
            { title: "TextField", href: "/components/inputs/text-field" },
            { title: "TextArea", href: "/components/inputs/text-area" },
            { title: "SearchField", href: "/components/inputs/search-field" },
            { title: "Checkbox", href: "/components/inputs/checkbox" },
            { title: "Checkbox Card", href: "/components/inputs/checkbox-card" },
            { title: "CheckBox Group", href: "/components/inputs/checkbox-group" },
            { title: "Radio Group", href: "/components/inputs/radio-group" },
            { title: "Radio Cards", href: "/components/inputs/radio-card" },
            { title: "Switch", href: "/components/inputs/switch" },
            { title: "Slider", href: "/components/inputs/slider" },
            { title: "Form", href: "/components/inputs/form" },
            // { title: "Input OTP", href: "/components/inputs/input-otp" },
          ],
        },
        {
          title: "Dates",
          items: getCategoryDocs("components/dates"),
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
            // { title: "Data table", href: "/components/data-display/data-table" },
            // { title: "Accordion", href: "/components/data-display/accordion" },
          ],
        },
        {
          title: "Menus",
          items: getCategoryDocs("components/menus"),
        },
        {
          title: "Navigation",
          items: [
            { title: "Link", href: "/components/navigation/link" },
            { title: "Tabs", href: "/components/navigation/tabs" },
            // { title: "Breadcrumbs", href: "/components/navigation/breadcrumbs" },
            // { title: "Command", href: "/components/navigation/command" },
            // { title: "Pagination", href: "/components/navigation/pagination" },
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
            { title: "Tooltip", href: "/components/overlay/tooltip" },
            { title: "Hover Card", href: "/components/overlay/hover-card" },
            // { title: "Context Menu", href: "/components/overlay/context-menu" },
          ],
        },
        {
          title: "Utils",
          items: getCategoryDocs("components/utils"),
        },
      ],
    },
    // {
    //   title: "Blocks",
    //   slug: "blocks",
    //   items: [
    //     {
    //       title: "Overview",
    //       href: "/blocks",
    //     },
    //     {
    //       title: "Marketing",
    //       items: getCategoryDocs("blocks/marketing"),
    //     },
    //     {
    //       title: "Application UI",
    //       items: getCategoryDocs("blocks/application-ui"),
    //     },
    //     {
    //       title: "E-commerce",
    //       items: getCategoryDocs("blocks/e-commerce"),
    //     },
    //   ],
    // },
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
    // {
    //   title: "Icons",
    //   slug: "icons",
    //   items: [
    //     {
    //       title: "Overview",
    //       href: "/icons",
    //     },
    //     ...getCategoryDocs("icons"),
    //   ],
    // },
    // {
    //   title: "Templates",
    //   slug: "templates",
    //   items: [
    //     {
    //       title: "Overview",
    //       href: "/templates",
    //     },
    //   ],
    // },
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
