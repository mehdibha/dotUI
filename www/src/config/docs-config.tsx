import { ReactNode } from "react";
import {
  BookIcon,
  BoxIcon,
  FunctionSquareIcon,
  PaletteIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  href?: string;
  label?: string;
  disabled?: boolean;
  items?: NavItem[];
};

type NavSection = {
  title: string;
  slug: string;
  icon: ReactNode;
  href?: string;
  items?: NavItem[];
};

type DocsConfig = {
  nav: NavSection[];
};

export const docsConfig: DocsConfig = {
  nav: [
    {
      title: "Getting Started",
      slug: "docs",
      href: "/docs/getting-started/installation",
      items: [
        { title: "Introduction", href: "/docs/getting-started/intro" },
        { title: "Installation", href: "/docs/getting-started/installation" },
        { title: "Config", href: "/docs/getting-started/config" },
        { title: "CLI", href: "/docs/getting-started/cli" },
        { title: "Color system", href: "/docs/getting-started/color-system" },
        { title: "Changelog", href: "/docs/getting-started/changelog" },
        { title: "Roadmap", href: "/docs/getting-started/roadmap" },
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
            { title: "Button", href: "/docs/components/buttons/button" },
            {
              title: "Toggle Button",
              href: "/docs/components/buttons/toggle-button",
            },
            {
              title: "File Trigger",
              href: "/docs/components/buttons/file-trigger",
            },
          ],
        },
        {
          title: "Inputs",
          items: [
            { title: "TextField", href: "/docs/components/inputs/text-field" },
            { title: "TextArea", href: "/docs/components/inputs/text-area" },
            {
              title: "SearchField",
              href: "/docs/components/inputs/search-field",
            },
            {
              title: "NumberField",
              href: "/docs/components/inputs/number-field",
            },
            { title: "Checkbox", href: "/docs/components/inputs/checkbox" },
            {
              title: "Checkbox Group",
              href: "/docs/components/inputs/checkbox-group",
            },
            {
              title: "Radio Group",
              href: "/docs/components/inputs/radio-group",
            },
            { title: "Switch", href: "/docs/components/inputs/switch" },
            { title: "Slider", href: "/docs/components/inputs/slider" },
          ],
        },
        {
          title: "Menus and Selection",
          items: [
            {
              title: "Menu",
              href: "/docs/components/menus-and-selection/menu",
            },
            {
              title: "ListBox",
              href: "/docs/components/menus-and-selection/list-box",
            },
            {
              title: "Select",
              href: "/docs/components/menus-and-selection/select",
            },
            {
              title: "Combobox",
              href: "/docs/components/menus-and-selection/combobox",
            },
          ],
        },
        {
          title: "Dates",
          items: [
            { title: "Calendar", href: "/docs/components/dates/calendar" },
            {
              title: "Range Calendar",
              href: "/docs/components/dates/range-calendar",
            },
            { title: "Time Field", href: "/docs/components/dates/time-field" },
            { title: "Date Field", href: "/docs/components/dates/date-field" },
            {
              title: "Date Picker",
              href: "/docs/components/dates/date-picker",
            },
            {
              title: "Date Range Picker",
              href: "/docs/components/dates/date-range-picker",
            },
          ],
        },
        {
          title: "Colors",
          items: [
            { title: "Color Area", href: "/docs/components/colors/color-area" },
            {
              title: "Color Field",
              href: "/docs/components/colors/color-field",
            },
            {
              title: "Color Slider",
              href: "/docs/components/colors/color-slider",
            },
            {
              title: "Color Swatch",
              href: "/docs/components/colors/color-swatch",
            },
            {
              title: "Color Picker",
              href: "/docs/components/colors/color-picker",
            },
          ],
        },
        {
          title: "Drag and drop",
          items: [
            {
              title: "DropZone",
              href: "/docs/components/drag-and-drop/drop-zone",
            },
          ],
        },
        {
          title: "Feedback",
          items: [
            { title: "Alert", href: "/docs/components/feedback/alert" },
            { title: "Progress", href: "/docs/components/feedback/progress" },
            { title: "Skeleton", href: "/docs/components/feedback/skeleton" },
          ],
        },
        {
          title: "Layout",
          items: [
            {
              title: "Aspect Ratio",
              href: "/docs/components/layout/aspect-ratio",
            },
            {
              title: "Scroll Area",
              href: "/docs/components/layout/scroll-area",
            },
          ],
        },
        {
          title: "Data display",
          items: [
            { title: "Avatar", href: "/docs/components/data-display/avatar" },
            { title: "Badge", href: "/docs/components/data-display/badge" },
            {
              title: "Separator",
              href: "/docs/components/data-display/separator",
            },
          ],
        },
        {
          title: "Navigation",
          items: [
            { title: "Link", href: "/docs/components/navigation/link" },
            { title: "Tabs", href: "/docs/components/navigation/tabs" },
            {
              title: "Breadcrumbs",
              href: "/docs/components/navigation/breadcrumbs",
            },
          ],
        },
        {
          title: "Overlay",
          items: [
            { title: "Dialog", href: "/docs/components/overlay/dialog" },
            {
              title: "Alert Dialog",
              href: "/docs/components/overlay/dialog#alert-dialog",
            },
            { title: "Drawer", href: "/docs/components/overlay/dialog#drawer" },
            {
              title: "Popover",
              href: "/docs/components/overlay/dialog#popover",
            },
            { title: "Tooltip", href: "/docs/components/overlay/tooltip" },
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
