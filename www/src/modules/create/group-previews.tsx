import type { ReactNode } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert";
import CardDemo from "@/registry/ui/card/demos/default";
import ColorSwatchPickerDemo from "@/registry/ui/color-swatch-picker/demos/basic";
import DisclosureDemo from "@/registry/ui/disclosure/demos/basic";
import InputDemo from "@/registry/ui/input/demos/default";
import ListBoxDemo from "@/registry/ui/list-box/demos/basic";
import PopoverDemo from "@/registry/ui/popover/demos/basic";
import { ProgressBar, ProgressBarControl, ProgressBarOutput } from "@/registry/ui/progress-bar";
import SliderDemo from "@/registry/ui/slider/demos/default";
import SwitchDemo from "@/registry/ui/switch/demos/basic";
import TagGroupDemo from "@/registry/ui/tag-group/demos/basic";

/**
 * A representative live component from each category — rendered (inert) inside its group card so
 * the card previews the real thing, not an icon. Only the configurable groups need an entry.
 */
const GROUP_PREVIEWS: Record<string, ReactNode> = {
	inputs: <InputDemo />,
	"selection-controls": <SwitchDemo />,
	sliders: <SliderDemo />,
	"menus-lists": <ListBoxDemo />,
	overlays: <PopoverDemo />,
	disclosure: <DisclosureDemo />,
	containers: <CardDemo />,
	feedback: (
		<Alert>
			<CircleAlertIcon />
			<AlertTitle>Heads up</AlertTitle>
			<AlertDescription>Theme this group together.</AlertDescription>
		</Alert>
	),
	progress: (
		<ProgressBar value={60} className="w-full">
			<ProgressBarOutput />
			<ProgressBarControl />
		</ProgressBar>
	),
	tags: <TagGroupDemo />,
	"color-swatches": <ColorSwatchPickerDemo />,
};

export function getGroupPreview(group: string): ReactNode {
	return GROUP_PREVIEWS[group] ?? null;
}
