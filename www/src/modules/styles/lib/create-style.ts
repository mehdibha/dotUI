import {
  DEFAULT_COMPONENTS,
  DEFAULT_FONTS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_PREFERENCES,
} from "@/modules/styles/constants/defaults";
import { Style, StyleFoundations } from "@/modules/styles/types";
import { createTheme } from "./create-theme";

export const createStyle = (opts: StyleFoundations): Style => {
  return {
    name: opts.name,
    icon: opts.icon,
    label: opts.label,
    theme: createTheme(opts.theme),
    iconLibrary: opts.iconLibrary ?? DEFAULT_ICON_LIBRARY,
    fonts: opts.fonts ?? DEFAULT_FONTS,
    components: { ...DEFAULT_COMPONENTS, ...opts.components },
    preferences: { ...DEFAULT_PREFERENCES, ...opts.preferences },
  };
};
