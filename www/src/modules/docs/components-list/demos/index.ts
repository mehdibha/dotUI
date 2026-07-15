import type { ComponentType } from 'react'

import { AccordionDemo } from './accordion'
import { AlertDemo } from './alert'
import { AvatarDemo } from './avatar'
import { BadgeDemo } from './badge'
import { BreadcrumbsDemo } from './breadcrumbs'
import { ButtonDemo } from './button'
import { CalendarDemo } from './calendar'
import { CardDemo } from './card'
import { ChartAreaDemo } from './chart-area'
import { ChartBarDemo } from './chart-bar'
import { ChartLineDemo } from './chart-line'
import { ChartPieDemo } from './chart-pie'
import { ChartRadarDemo } from './chart-radar'
import { ChartRadialDemo } from './chart-radial'
import { CheckboxDemo } from './checkbox'
import { CheckboxGroupDemo } from './checkbox-group'
import { ColorAreaDemo } from './color-area'
import { ColorFieldDemo } from './color-field'
import { ColorPickerDemo } from './color-picker'
import { ColorSliderDemo } from './color-slider'
import { ColorSwatchPickerDemo } from './color-swatch-picker'
import { ComboboxDemo } from './combobox'
import { CommandDemo } from './command'
import { DateFieldDemo } from './date-field'
import { DatePickerDemo } from './date-picker'
import { DialogDemo } from './dialog'
import { DrawerDemo } from './drawer'
import { EmptyDemo } from './empty'
import { FieldDemo } from './field'
import { FileTriggerDemo } from './file-trigger'
import { GroupDemo } from './group'
import { InputDemo } from './input'
import { InputGroupDemo } from './input-group'
import { KbdDemo } from './kbd'
import { LinkDemo } from './link'
import { ListBoxDemo } from './list-box'
import { LoaderDemo } from './loader'
import { MentionDemo } from './mention'
import { MenuDemo } from './menu'
import { ModalDemo } from './modal'
import { NumberFieldDemo } from './number-field'
import { OTPFieldDemo } from './otp-field'
import { PaginationDemo } from './pagination'
import { PopoverDemo } from './popover'
import { ProgressBarDemo } from './progress-bar'
import { QRCodeDemo } from './qr-code'
import { RadioGroupDemo } from './radio-group'
import { SearchFieldDemo } from './search-field'
import { SelectDemo } from './select'
import { SeparatorDemo } from './separator'
import { SidebarDemo } from './sidebar'
import { SkeletonDemo } from './skeleton'
import { SliderDemo } from './slider'
import { SwitchDemo } from './switch'
import { TableDemo } from './table'
import { TabsDemo } from './tabs'
import { TagGroupDemo } from './tag-group'
import { TextAreaDemo } from './text-area'
import { TextFieldDemo } from './text-field'
import { TimeFieldDemo } from './time-field'
import { ToastDemo } from './toast'
import { ToggleButtonDemo } from './toggle-button'
import { ToggleButtonGroupDemo } from './toggle-button-group'
import { TooltipDemo } from './tooltip'
import { TreeDemo } from './tree'

export const componentDemos: Record<string, ComponentType> = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  breadcrumbs: BreadcrumbsDemo,
  button: ButtonDemo,
  calendar: CalendarDemo,
  card: CardDemo,
  'chart-area': ChartAreaDemo,
  'chart-bar': ChartBarDemo,
  'chart-line': ChartLineDemo,
  'chart-pie': ChartPieDemo,
  'chart-radar': ChartRadarDemo,
  'chart-radial': ChartRadialDemo,
  checkbox: CheckboxDemo,
  'checkbox-group': CheckboxGroupDemo,
  'color-area': ColorAreaDemo,
  'color-field': ColorFieldDemo,
  'color-picker': ColorPickerDemo,
  'color-slider': ColorSliderDemo,
  'color-swatch-picker': ColorSwatchPickerDemo,
  combobox: ComboboxDemo,
  command: CommandDemo,
  'date-field': DateFieldDemo,
  'date-picker': DatePickerDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  'file-trigger': FileTriggerDemo,
  group: GroupDemo,
  input: InputDemo,
  'input-group': InputGroupDemo,
  kbd: KbdDemo,
  link: LinkDemo,
  'list-box': ListBoxDemo,
  loader: LoaderDemo,
  mention: MentionDemo,
  menu: MenuDemo,
  modal: ModalDemo,
  'number-field': NumberFieldDemo,
  'otp-field': OTPFieldDemo,
  pagination: PaginationDemo,
  popover: PopoverDemo,
  'progress-bar': ProgressBarDemo,
  'qr-code': QRCodeDemo,
  'radio-group': RadioGroupDemo,
  'search-field': SearchFieldDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  sidebar: SidebarDemo,
  skeleton: SkeletonDemo,
  slider: SliderDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  'tag-group': TagGroupDemo,
  'text-area': TextAreaDemo,
  'text-field': TextFieldDemo,
  'time-field': TimeFieldDemo,
  toast: ToastDemo,
  'toggle-button': ToggleButtonDemo,
  'toggle-button-group': ToggleButtonGroupDemo,
  tooltip: TooltipDemo,
  tree: TreeDemo,
}
