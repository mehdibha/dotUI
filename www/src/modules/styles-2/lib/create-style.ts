import {
  DEFAULT_COMPONENTS,
  DEFAULT_FONTS,
  DEFAULT_ICON_LIBRARY,
} from "@/modules/styles-2/constants/defaults";
import { Style, StyleFoudations } from "@/modules/styles-2/types";
import { createTheme } from "./create-theme";

export const createStyle = (opts: StyleFoudations): Style => {
  return {
    name: opts.name,
    label: opts.label,
    theme: createTheme(opts.theme),
    iconLibrary: opts.iconLibrary ?? DEFAULT_ICON_LIBRARY,
    fonts: opts.fonts ?? DEFAULT_FONTS,
    components: { ...DEFAULT_COMPONENTS, ...opts.components },
  };
};
