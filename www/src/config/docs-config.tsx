import {
  BookIcon,
  BoxIcon,
  CodeIcon,
  FunctionSquareIcon,
  PaletteIcon,
} from "lucide-react";
import type { DocsConfig } from "@/types/docs";

export const docsConfig: DocsConfig = {
  nav: [
    {
      title: "Getting Started",
      slug: "docs",
      href: "/docs/installation",
      items: [
        { title: "Introduction", href: "/docs/intro" },
        { title: "Installation", href: "/docs/installation" },
        { title: "Config", href: "/docs/config" },
        { title: "CLI", href: "/docs/cli" },
        { title: "Color system", href: "/docs/color-system" },
        { title: "Changelog", href: "/docs/changelog" },
        { title: "Roadmap", href: "/docs/roadmap" },
      ],
      icon: <BookIcon />,
    },
    {
      title: "Components",
      slug: "components",
      icon: <BoxIcon />,
      href: "/components/buttons/button",
      items: [
        {
          title: "Buttons",
          items: [
            { title: "Button", href: "/components/buttons/button" },
            {
              title: "Toggle Button",
              href: "/components/buttons/toggle-button",
            },
            { title: "File Trigger", href: "/components/buttons/file-trigger" },
          ],
        },
        {
          title: "Inputs",
          items: [
            { title: "TextField", href: "/components/inputs/text-field" },
            { title: "TextArea", href: "/components/inputs/text-area" },
            { title: "SearchField", href: "/components/inputs/search-field" },
            { title: "NumberField", href: "/components/inputs/number-field" },
            { title: "Checkbox", href: "/components/inputs/checkbox" },
            {
              title: "Checkbox Group",
              href: "/components/inputs/checkbox-group",
            },
            { title: "Radio Group", href: "/components/inputs/radio-group" },
            { title: "Switch", href: "/components/inputs/switch" },
            { title: "Slider", href: "/components/inputs/slider" },
          ],
        },
        {
          title: "Menus and Selection",
          items: [
            { title: "Menu", href: "/components/menus-and-selection/menu" },
            {
              title: "ListBox",
              href: "/components/menus-and-selection/list-box",
            },
            { title: "Select", href: "/components/menus-and-selection/select" },
            {
              title: "Combobox",
              href: "/components/menus-and-selection/combobox",
            },
          ],
        },
        {
          title: "Dates",
          items: [
            { title: "Calendar", href: "/components/dates/calendar" },
            {
              title: "Range Calendar",
              href: "/components/dates/range-calendar",
            },
            { title: "Time Field", href: "/components/dates/time-field" },
            { title: "Date Field", href: "/components/dates/date-field" },
            { title: "Date Picker", href: "/components/dates/date-picker" },
            {
              title: "Date Range Picker",
              href: "/components/dates/date-range-picker",
            },
          ],
        },
        {
          title: "Colors",
          items: [
            { title: "Color Area", href: "/components/colors/color-area" },
            { title: "Color Field", href: "/components/colors/color-field" },
            { title: "Color Slider", href: "/components/colors/color-slider" },
            { title: "Color Swatch", href: "/components/colors/color-swatch" },
            { title: "Color Picker", href: "/components/colors/color-picker" },
          ],
        },
        {
          title: "Drag and drop",
          items: [
            { title: "DropZone", href: "/components/drag-and-drop/drop-zone" },
          ],
        },
        {
          title: "Feedback",
          items: [
            { title: "Alert", href: "/components/feedback/alert" },
            { title: "Progress", href: "/components/feedback/progress" },
            { title: "Skeleton", href: "/components/feedback/skeleton" },
          ],
        },
        {
          title: "Layout",
          items: [
            { title: "Aspect Ratio", href: "/components/layout/aspect-ratio" },
            { title: "Scroll Area", href: "/components/layout/scroll-area" },
          ],
        },
        {
          title: "Data display",
          items: [
            { title: "Avatar", href: "/components/data-display/avatar" },
            { title: "Badge", href: "/components/data-display/badge" },
            { title: "Separator", href: "/components/data-display/separator" },
          ],
        },
        {
          title: "Navigation",
          items: [
            { title: "Link", href: "/components/navigation/link" },
            { title: "Tabs", href: "/components/navigation/tabs" },
            {
              title: "Breadcrumbs",
              href: "/components/navigation/breadcrumbs",
            },
          ],
        },
        {
          title: "Overlay",
          items: [
            { title: "Dialog", href: "/components/overlay/dialog" },
            {
              title: "Alert Dialog",
              href: "/components/overlay/dialog#alert-dialog",
            },
            { title: "Drawer", href: "/components/overlay/dialog#drawer" },
            { title: "Popover", href: "/components/overlay/dialog#popover" },
            { title: "Tooltip", href: "/components/overlay/tooltip" },
          ],
        },
      ],
    },
    {
      title: "Hooks",
      slug: "hooks",
      icon: <FunctionSquareIcon />,
      items: [
        {
          title: "browser",
          items: [
            { title: "useMediaQuery", href: "/hooks/browser/use-media-query" },
          ],
        },
        {
          title: "elements",
          items: [
            { title: "useInView", href: "/hooks/elements/use-in-view" },
            {
              title: "useIntersectionObserver",
              href: "/hooks/elements/use-intersection-observer",
            },
            { title: "useWindowSize", href: "/hooks/elements/use-window-size" },
          ],
        },
        {
          title: "sensors",
          items: [
            { title: "useBattery", href: "/hooks/sensors/use-battery" },
            { title: "useMouse", href: "/hooks/sensors/use-mouse" },
            { title: "useOrientation", href: "/hooks/sensors/use-orientation" },
          ],
        },
        {
          title: "state",
          items: [
            {
              title: "useLocalStorage",
              href: "/hooks/state/use-local-storage",
            },
          ],
        },
        {
          title: "utils",
          items: [
            { title: "useCounter", href: "/hooks/utils/use-counter" },
            { title: "useDebounce", href: "/hooks/utils/use-debounce" },
            { title: "useIsClient", href: "/hooks/utils/use-is-client" },
            { title: "useList", href: "/hooks/utils/use-list" },
            { title: "useMounted", href: "/hooks/utils/use-mounted" },
            { title: "usePrevious", href: "/hooks/utils/use-previous" },
          ],
        },
      ],
    },
    {
      title: "Themes",
      slug: "themes",
      icon: <PaletteIcon />,
      href: "/themes",
    },
  ],
};