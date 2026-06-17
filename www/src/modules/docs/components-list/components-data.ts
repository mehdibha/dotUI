export type ComponentStatus = 'pending' | 'in review' | 'done'

export interface ComponentInfo {
  name: string
  slug: string
  href: string
  scale?: number
  status: ComponentStatus
}

export interface ComponentCategory {
  title: string
  slug: string
  components: ComponentInfo[]
}

export const componentsData: ComponentCategory[] = [
  {
    title: 'Buttons',
    slug: 'buttons',
    components: [
      {
        name: 'Button',
        slug: 'button',
        href: '/docs/components/button',
        scale: 1,
        status: 'done',
      },
      {
        name: 'ToggleButton',
        slug: 'toggle-button',
        href: '/docs/components/toggle-button',
        scale: 1,
        status: 'in review',
      },
      {
        name: 'ToggleButtonGroup',
        slug: 'toggle-button-group',
        href: '/docs/components/toggle-button-group',
        scale: 1,
        status: 'in review',
      },
      {
        name: 'FileTrigger',
        slug: 'file-trigger',
        href: '/docs/components/file-trigger',
        scale: 1,
        status: 'done',
      },
      {
        name: 'Group',
        slug: 'group',
        href: '/docs/components/group',
        scale: 0.9,
        status: 'done',
      },
    ],
  },
  {
    title: 'Inputs, controls and form',
    slug: 'inputs',
    components: [
      {
        name: 'Input',
        slug: 'input',
        href: '/docs/components/input',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'TextArea',
        slug: 'text-area',
        href: '/docs/components/text-area',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'InputGroup',
        slug: 'input-group',
        href: '/docs/components/input-group',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'TextField',
        slug: 'text-field',
        href: '/docs/components/text-field',
        scale: 0.9,
        status: 'in review',
      },
      {
        name: 'SearchField',
        slug: 'search-field',
        href: '/docs/components/search-field',
        scale: 0.9,
        status: 'in review',
      },
      {
        name: 'NumberField',
        slug: 'number-field',
        href: '/docs/components/number-field',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'OTPField',
        slug: 'otp-field',
        href: '/docs/components/otp-field',
        scale: 0.8,
        status: 'in review',
      },
      {
        name: 'Checkbox',
        slug: 'checkbox',
        href: '/docs/components/checkbox',
        scale: 0.95,
        status: 'done',
      },
      {
        name: 'CheckboxGroup',
        slug: 'checkbox-group',
        href: '/docs/components/checkbox-group',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'RadioGroup',
        slug: 'radio-group',
        href: '/docs/components/radio-group',
        scale: 0.9,
        status: 'in review',
      },
      {
        name: 'Switch',
        slug: 'switch',
        href: '/docs/components/switch',
        scale: 0.9,
        status: 'in review',
      },
      {
        name: 'Slider',
        slug: 'slider',
        href: '/docs/components/slider',
        scale: 0.9,
        status: 'pending',
      },
      {
        name: 'Field',
        slug: 'field',
        href: '/docs/components/field',
        scale: 0.9,
        status: 'pending',
      },
    ],
  },
  {
    title: 'Pickers',
    slug: 'pickers',
    components: [
      {
        name: 'Menu',
        slug: 'menu',
        href: '/docs/components/menu',
        scale: 1,
        status: 'in review',
      },
      {
        name: 'Combobox',
        slug: 'combobox',
        href: '/docs/components/combobox',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'Select',
        slug: 'select',
        href: '/docs/components/select',
        scale: 0.95,
        status: 'done',
      },
    ],
  },
  {
    title: 'Dates',
    slug: 'dates',
    components: [
      {
        name: 'Calendar',
        slug: 'calendar',
        href: '/docs/components/calendar',
        scale: 0.5,
        status: 'pending',
      },
      {
        name: 'DateField',
        slug: 'date-field',
        href: '/docs/components/date-field',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'DatePicker',
        slug: 'date-picker',
        href: '/docs/components/date-picker',
        scale: 0.8,
        status: 'done',
      },
      {
        name: 'TimeField',
        slug: 'time-field',
        href: '/docs/components/time-field',
        scale: 0.9,
        status: 'in review',
      },
    ],
  },
  {
    title: 'Feedback',
    slug: 'feedback',
    components: [
      {
        name: 'Alert',
        slug: 'alert',
        href: '/docs/components/alert',
        scale: 0.6,
        status: 'done',
      },
      {
        name: 'ProgressBar',
        slug: 'progress-bar',
        href: '/docs/components/progress-bar',
        scale: 1,
        status: 'pending',
      },
      {
        name: 'Toast',
        slug: 'toast',
        href: '/docs/components/toast',
        scale: 0.75,
        status: 'pending',
      },
      {
        name: 'Loader',
        slug: 'loader',
        href: '/docs/components/loader',
        scale: 1,
        status: 'pending',
      },
      {
        name: 'Skeleton',
        slug: 'skeleton',
        href: '/docs/components/skeleton',
        scale: 0.45,
        status: 'pending',
      },
    ],
  },
  {
    title: 'Collections',
    slug: 'collections',
    components: [
      {
        name: 'ListBox',
        slug: 'list-box',
        href: '/docs/components/list-box',
        scale: 0.8,
        status: 'done',
      },
      {
        name: 'TagGroup',
        slug: 'tag-group',
        href: '/docs/components/tag-group',
        scale: 0.9,
        status: 'done',
      },
    ],
  },
  {
    title: 'Navigation',
    slug: 'navigation',
    components: [
      {
        name: 'Link',
        slug: 'link',
        href: '/docs/components/link',
        scale: 1,
        status: 'pending',
      },
      {
        name: 'Tabs',
        slug: 'tabs',
        href: '/docs/components/tabs',
        scale: 0.8,
        status: 'pending',
      },
      {
        name: 'Breadcrumbs',
        slug: 'breadcrumbs',
        href: '/docs/components/breadcrumbs',
        scale: 0.85,
        status: 'done',
      },
      {
        name: 'Command',
        slug: 'command',
        href: '/docs/components/command',
        scale: 0.7,
        status: 'done',
      },
      {
        name: 'Pagination',
        slug: 'pagination',
        href: '/docs/components/pagination',
        scale: 0.8,
        status: 'in review',
      },
      {
        name: 'Sidebar',
        slug: 'sidebar',
        href: '/docs/components/sidebar',
        scale: 0.45,
        status: 'done',
      },
    ],
  },
  {
    title: 'Data display',
    slug: 'data-display',
    components: [
      {
        name: 'Accordion',
        slug: 'accordion',
        href: '/docs/components/accordion',
        scale: 0.65,
        status: 'done',
      },
      {
        name: 'Avatar',
        slug: 'avatar',
        href: '/docs/components/avatar',
        scale: 0.6,
        status: 'done',
      },
      {
        name: 'Kbd',
        slug: 'kbd',
        href: '/docs/components/kbd',
        scale: 1,
        status: 'done',
      },
      {
        name: 'Badge',
        slug: 'badge',
        href: '/docs/components/badge',
        scale: 0.9,
        status: 'done',
      },
      {
        name: 'Table',
        slug: 'table',
        href: '/docs/components/table',
        scale: 0.45,
        status: 'pending',
      },
      {
        name: 'Card',
        slug: 'card',
        href: '/docs/components/card',
        scale: 0.45,
        status: 'done',
      },
      {
        name: 'ScrollFade',
        slug: 'scroll-fade',
        href: '/docs/components/scroll-fade',
        scale: 0.75,
        status: 'in review',
      },
      {
        name: 'Separator',
        slug: 'separator',
        href: '/docs/components/separator',
        scale: 0.8,
        status: 'pending',
      },
      {
        name: 'Empty',
        slug: 'empty',
        href: '/docs/components/empty',
        scale: 0.55,
        status: 'done',
      },
    ],
  },
  {
    title: 'Colors',
    slug: 'colors',
    components: [
      {
        name: 'ColorArea',
        slug: 'color-area',
        href: '/docs/components/color-area',
        scale: 0.55,
        status: 'pending',
      },
      {
        name: 'ColorField',
        slug: 'color-field',
        href: '/docs/components/color-field',
        scale: 0.9,
        status: 'pending',
      },
      {
        name: 'ColorPicker',
        slug: 'color-picker',
        href: '/docs/components/color-picker',
        scale: 0.65,
        status: 'pending',
      },
      {
        name: 'ColorSlider',
        slug: 'color-slider',
        href: '/docs/components/color-slider',
        scale: 0.9,
        status: 'pending',
      },
      {
        name: 'ColorSwatchPicker',
        slug: 'color-swatch-picker',
        href: '/docs/components/color-swatch-picker',
        scale: 0.8,
        status: 'pending',
      },
    ],
  },
  {
    title: 'Overlays',
    slug: 'overlays',
    components: [
      {
        name: 'Modal',
        slug: 'modal',
        href: '/docs/components/modal',
        scale: 1,
        status: 'done',
      },
      {
        name: 'Popover',
        slug: 'popover',
        href: '/docs/components/popover',
        scale: 1,
        status: 'done',
      },
      {
        name: 'Drawer',
        slug: 'drawer',
        href: '/docs/components/drawer',
        scale: 1,
        status: 'in review',
      },
      {
        name: 'Tooltip',
        slug: 'tooltip',
        href: '/docs/components/tooltip',
        scale: 1,
        status: 'pending',
      },
    ],
  },
]
