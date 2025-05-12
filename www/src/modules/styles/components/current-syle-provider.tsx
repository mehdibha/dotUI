"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useStyles } from "@/modules/styles/atoms/styles-atom";
import { createStyle } from "@/modules/styles/lib/create-style";
import { StyleProvider, StyleProviderProps } from "./style-provider";

interface CurrentStyleProviderProps extends Omit<StyleProviderProps, "style"> {}

export const CurrentStyleProvider = ({
  children,
  ...props
}: CurrentStyleProviderProps) => {
  const { currentStyle } = useStyles();
  const isMounted = useMounted();

  if (!isMounted) return children;

  const style = createStyle(currentStyle);

  return (
    <StyleProvider style={style} {...props}>
      {children}
    </StyleProvider>
  );
};
