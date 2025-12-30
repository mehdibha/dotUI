import type { ComponentType } from "react";

import { AccordionDemo } from "./accordion";
import { AlertDemo } from "./alert";
import { AvatarDemo } from "./avatar";
import { BadgeDemo } from "./badge";
import { BreadcrumbsDemo } from "./breadcrumbs";
import { ButtonDemo } from "./button";
import { CalendarDemo } from "./calendar";
import { CardDemo } from "./card";
import { CheckboxDemo } from "./checkbox";
import { ColorAreaDemo } from "./color-area";
import { ColorFieldDemo } from "./color-field";
import { ColorPickerDemo } from "./color-picker";
import { ColorSliderDemo } from "./color-slider";
import { ColorSwatchPickerDemo } from "./color-swatch-picker";
import { ComboboxDemo } from "./combobox";
import { CommandDemo } from "./command";
import { DateFieldDemo } from "./date-field";
import { DatePickerDemo } from "./date-picker";
import { DialogDemo } from "./dialog";
import { DrawerDemo } from "./drawer";
import { EmptyDemo } from "./empty";
import { FieldDemo } from "./field";
import { FileTriggerDemo } from "./file-trigger";
import { GroupDemo } from "./group";
import { InputDemo } from "./input";
import { InputGroupDemo } from "./input-group";
import { KbdDemo } from "./kbd";
import { LinkDemo } from "./link";
import { ListBoxDemo } from "./list-box";
import { LoaderDemo } from "./loader";
import { MenuDemo } from "./menu";
import { ModalDemo } from "./modal";
import { NumberFieldDemo } from "./number-field";
import { PopoverDemo } from "./popover";
import { ProgressBarDemo } from "./progress-bar";
import { RadioGroupDemo } from "./radio-group";
import { SearchFieldDemo } from "./search-field";
import { SelectDemo } from "./select";
import { SeparatorDemo } from "./separator";
import { SkeletonDemo } from "./skeleton";
import { SliderDemo } from "./slider";
import { SwitchDemo } from "./switch";
import { TableDemo } from "./table";
import { TabsDemo } from "./tabs";
import { TagGroupDemo } from "./tag-group";
import { TextAreaDemo } from "./text-area";
import { TextFieldDemo } from "./text-field";
import { TimeFieldDemo } from "./time-field";
import { ToastDemo } from "./toast";
import { ToggleButtonDemo } from "./toggle-button";
import { ToggleButtonGroupDemo } from "./toggle-button-group";
import { TooltipDemo } from "./tooltip";

export const componentDemos: Record<string, ComponentType> = {
	accordion: AccordionDemo,
	alert: AlertDemo,
	avatar: AvatarDemo,
	badge: BadgeDemo,
	breadcrumbs: BreadcrumbsDemo,
	button: ButtonDemo,
	calendar: CalendarDemo,
	card: CardDemo,
	checkbox: CheckboxDemo,
	"color-area": ColorAreaDemo,
	"color-field": ColorFieldDemo,
	"color-picker": ColorPickerDemo,
	"color-slider": ColorSliderDemo,
	"color-swatch-picker": ColorSwatchPickerDemo,
	combobox: ComboboxDemo,
	command: CommandDemo,
	"date-field": DateFieldDemo,
	"date-picker": DatePickerDemo,
	dialog: DialogDemo,
	drawer: DrawerDemo,
	empty: EmptyDemo,
	field: FieldDemo,
	"file-trigger": FileTriggerDemo,
	group: GroupDemo,
	input: InputDemo,
	"input-group": InputGroupDemo,
	kbd: KbdDemo,
	link: LinkDemo,
	"list-box": ListBoxDemo,
	loader: LoaderDemo,
	menu: MenuDemo,
	modal: ModalDemo,
	"number-field": NumberFieldDemo,
	popover: PopoverDemo,
	"progress-bar": ProgressBarDemo,
	"radio-group": RadioGroupDemo,
	"search-field": SearchFieldDemo,
	select: SelectDemo,
	separator: SeparatorDemo,
	skeleton: SkeletonDemo,
	slider: SliderDemo,
	switch: SwitchDemo,
	table: TableDemo,
	tabs: TabsDemo,
	"tag-group": TagGroupDemo,
	"text-area": TextAreaDemo,
	"text-field": TextFieldDemo,
	"time-field": TimeFieldDemo,
	toast: ToastDemo,
	"toggle-button": ToggleButtonDemo,
	"toggle-button-group": ToggleButtonGroupDemo,
	tooltip: TooltipDemo,
};
