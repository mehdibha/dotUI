"use client";

import { useStyles } from "@/modules/styles-2/atoms/styles-atom";
import { StyleProvider, StyleProviderProps } from "./style-provider";

interface CurrentStyleProviderProps extends Omit<StyleProviderProps, "style"> {}

export const CurrentStyleProvider = ({
  children,
  ...props
}: CurrentStyleProviderProps) => {
  const { currentStyle } = useStyles();

  return (
    <StyleProvider style={currentStyle} {...props}>
      {children}
    </StyleProvider>
  );
};
