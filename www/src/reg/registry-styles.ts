import type { Theme } from "@/modules/styles/types";
import { brutalistTheme } from "@/reg/styles/brutalist";
import { forestTheme } from "@/reg/styles/forest";
import { highContrastTheme } from "@/reg/styles/high-contrast";
import { materialTheme } from "@/reg/styles/material";
import { minimalistTheme } from "@/reg/styles/minimalist";
import { retroTheme } from "@/reg/styles/retro";

export const styles: Theme[] = [
  minimalistTheme,
  materialTheme,
  forestTheme,
  brutalistTheme,
  highContrastTheme,
  retroTheme,
];
