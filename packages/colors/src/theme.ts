import { createContrastTheme } from "./contrast/theme";
import { createMaterialTheme } from "./material";
import type { CreateThemeOptions } from "./schema";
import type { Theme } from "./shared/types";

export function createTheme(options: CreateThemeOptions): Theme {
	if (options.algorithm === "material") {
		const { algorithm: _, ...rest } = options;
		return createMaterialTheme(rest);
	}

	const { algorithm: _, ...rest } = options;
	return createContrastTheme(rest);
}
