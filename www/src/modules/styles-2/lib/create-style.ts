import { Style } from "@/modules/styles-2/types";

export const createStyle = (): Style => {
  return {
    name: "minimalist",
    theme: {
      light: {},
      dark: {},
      cssVars: {},
    },
    iconLibrary: "lucide",
    fonts: {
      heading: "",
      body: "",
    },
    components: [],
  };
};
