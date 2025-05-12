import {
  DEFAULT_COMPONENTS,
  DEFAULT_FONTS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_PREFERENCES,
} from "@/modules/styles/constants/defaults";
import { Style, StyleFoudations } from "@/modules/styles/types";
import { createTheme } from "./create-theme";

export const createStyle = (opts: StyleFoudations): Style => {
  console.log(opts);
  return {
    name: opts.name,
    label: opts.label,
    theme: createTheme(opts.theme),
    iconLibrary: opts.iconLibrary ?? DEFAULT_ICON_LIBRARY,
    fonts: opts.fonts ?? DEFAULT_FONTS,
    components: { ...DEFAULT_COMPONENTS, ...opts.components },
    preferences: { ...DEFAULT_PREFERENCES, ...opts.preferences },
  };
};
