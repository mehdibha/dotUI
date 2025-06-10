import React from "react";
import type { Style } from "@/modules/styles/types";
import { styles } from "@/registry/registry-styles";

const defaultStyle: Style = styles[0]!;

export const StyleContext = React.createContext<{
  style: Style;
}>({ style: defaultStyle });
