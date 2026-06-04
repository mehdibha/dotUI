import type { ComponentType } from "react";

import { DrawerPreview } from "./drawer";
import { ModalPreview } from "./modal";
import { PopoverPreview } from "./popover";
import { TooltipPreview } from "./tooltip";

/**
 * Static "open" previews for overlay components, shown on the components page.
 * Keyed by component slug. See ./inert-preview for why these are rebuilt from
 * style slots instead of rendering the real (portaling, focus-trapping) overlays.
 */
export const overlayPreviews: Record<string, ComponentType> = {
	modal: ModalPreview,
	popover: PopoverPreview,
	drawer: DrawerPreview,
	tooltip: TooltipPreview,
};
