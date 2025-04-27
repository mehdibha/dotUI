import type { Theme } from "@/modules/themes/types";
import { brutalistTheme } from "@/reg/themes/brutalist";
import { forestTheme } from "@/reg/themes/forest";
import { highContrastTheme } from "@/reg/themes/high-contrast";
import { materialTheme } from "@/reg/themes/material";
import { minimalistTheme } from "@/reg/themes/minimalist";
import { retroTheme } from "@/reg/themes/retro";

export const themes: Theme[] = [
  minimalistTheme,
  materialTheme,
  forestTheme,
  brutalistTheme,
  highContrastTheme,
  retroTheme,
];
