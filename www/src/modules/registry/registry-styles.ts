import { Style } from "@/modules/styles/types";
import { geistTheme } from "./styles/geist";
import { ghibliTheme } from "./styles/ghibli";
import { materialTheme } from "./styles/material";
import { minimalistTheme } from "./styles/minimalist";
import { polarisTheme } from "./styles/polaris";
import { primerTheme } from "./styles/primer";
import { supabaseTheme } from "./styles/supabase";

export const styles: Style[] = [
  minimalistTheme,
  materialTheme,
  ghibliTheme,
  primerTheme,
  supabaseTheme,
  geistTheme,
  polarisTheme,
];
