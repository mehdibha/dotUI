"use client";

import React from "react";

import { StyleProvider } from "@dotui/ui";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useActiveStyleSuspense } from "@/modules/styles/hooks/use-active-style-suspense";

export function ActiveStyleProviderSuspense(
  props: Omit<React.ComponentProps<"div">, "style">,
) {
  const { activeMode } = usePreferences();
  const { data: activeStyle } = useActiveStyleSuspense(); // This will suspend

  return (
    <StyleProvider mode={activeMode} style={activeStyle} {...props}>
      {props.children}
    </StyleProvider>
  );
}
