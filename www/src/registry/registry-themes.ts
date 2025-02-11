import { brutalistTheme } from "@/registry/themes/brutalist";
import { forestTheme } from "@/registry/themes/forest";
import { highContrastTheme } from "@/registry/themes/high-contrast";
import { materialTheme } from "@/registry/themes/material";
import { minimalistTheme } from "@/registry/themes/minimalist";
import { retroTheme } from "@/registry/themes/retro";
import type { Theme } from "@/modules/themes/types";

// import { darkyTheme } from "./themes/darky";

export const themes: Theme[] = [
  minimalistTheme,
  // darkyTheme,
  materialTheme,
  forestTheme,
  brutalistTheme,
  highContrastTheme,
  retroTheme,
];
