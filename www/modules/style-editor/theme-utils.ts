import { produce } from "immer";
import type { Color } from "react-aria-components";

import type { ThemeDefinition } from "@dotui/style-system/types";

export const convertThemeColorObjects = (theme: ThemeDefinition): ThemeDefinition => {
	return produce(theme, (draft) => {
		(["light", "dark"] as const).forEach((mode) => {
			const modeData = draft.colors.modes[mode];
			(Object.keys(modeData.scales) as (keyof typeof modeData.scales)[]).forEach((scaleKey) => {
				const scale = modeData.scales[scaleKey];
				scale.colorKeys = scale.colorKeys.map((colorKey: string | Color) =>
					typeof colorKey === "string" ? colorKey : colorKey.toString("hsl"),
				);
			});
		});
	});
};
