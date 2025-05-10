import React from "react";
import { Style } from "@/modules/styles-2/types";

const defaultStyle: Style = {
  name: "default",
  components: {},
  iconLibrary: "lucide",
  theme: {
    light: {},
    dark: {},
    cssVars: {},
  },
  fonts: {
    heading: "",
    body: "",
  },
};

export const StyleContext = React.createContext<{
  style: Style;
}>({ style: defaultStyle });
