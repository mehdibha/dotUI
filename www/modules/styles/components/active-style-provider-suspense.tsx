"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { StyleProvider } from "@dotui/ui";

import { useTRPC } from "@/lib/trpc/react";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useActiveStyleSuspense } from "@/modules/styles/hooks/use-active-style-suspense";

export function ActiveStyleProviderSuspense(
  props: Omit<React.ComponentProps<"div">, "style">,
) {
  const { activeMode } = usePreferences();
  const { data: activeStyle } = useActiveStyleSuspense();

  return (
    <StyleProvider mode={activeMode} style={activeStyle} {...props}>
      {props.children}
    </StyleProvider>
  );
}
