import type { ComponentType } from "react";

import { ComboboxPreview } from "./combobox";
import { DatePickerPreview } from "./date-picker";
import { DrawerPreview } from "./drawer";
import { MenuPreview } from "./menu";
import { ModalPreview } from "./modal";
import { PopoverPreview } from "./popover";
import { SelectPreview } from "./select";
import { TooltipPreview } from "./tooltip";

/**
 * Interactive previews for overlay/picker components on the components page.
 * Keyed by component slug. Each renders the real component (closed) inside a
 * sandbox that portals its overlay INTO the card (see ./live-preview), so
 * clicking the trigger opens it contained in the card without covering the page.
 */
export const overlayPreviews: Record<string, ComponentType> = {
	modal: ModalPreview,
	popover: PopoverPreview,
	drawer: DrawerPreview,
	tooltip: TooltipPreview,
	menu: MenuPreview,
	select: SelectPreview,
	combobox: ComboboxPreview,
	"date-picker": DatePickerPreview,
};
