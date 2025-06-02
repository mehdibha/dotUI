import React from "react";
import { styles } from "@/registry/registry-styles";
import { Style } from "@/modules/styles/types";

const defaultStyle: Style = styles[0]!;

export const StyleContext = React.createContext<{
  style: Style;
}>({ style: defaultStyle });
