"use client";

import { useStyles } from "@/modules/styles-2/atoms/styles-atom";
import { createStyle } from "@/modules/styles-2/lib/create-style";
import { StyleProvider, StyleProviderProps } from "./style-provider";

interface CurrentStyleProviderProps extends Omit<StyleProviderProps, "style"> {}

export const CurrentStyleProvider = ({
  children,
  ...props
}: CurrentStyleProviderProps) => {
  const { currentStyle } = useStyles();

  const style = createStyle(currentStyle);

  return (
    <StyleProvider style={style} {...props}>
      {children}
    </StyleProvider>
  );
};
