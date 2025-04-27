import { brutalistTheme } from "@/modules/registry/styles/brutalist";
import { forestTheme } from "@/modules/registry/styles/forest";
import { highContrastTheme } from "@/modules/registry/styles/high-contrast";
import { materialTheme } from "@/modules/registry/styles/material";
import { minimalistTheme } from "@/modules/registry/styles/minimalist";
import { retroTheme } from "@/modules/registry/styles/retro";
import type { Theme } from "@/modules/styles/types";

export const styles: Theme[] = [
  minimalistTheme,
  materialTheme,
  forestTheme,
  brutalistTheme,
  highContrastTheme,
  retroTheme,
];
