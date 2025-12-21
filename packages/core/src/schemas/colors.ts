/**
 * Colors schema - re-exported from @dotui/colors
 *
 * The colors config is exactly what createTheme expects,
 * keeping the DB schema in sync with the colors API.
 */

import { createThemeOptionsSchema } from "@dotui/colors";

export const colorsConfigSchema = createThemeOptionsSchema;

export type ColorsConfig = typeof colorsConfigSchema._output;
