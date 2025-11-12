"use client";

import React from "react";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/registry";
import { cn } from "@dotui/registry/lib/utils";
import { Alert } from "@dotui/registry/ui/alert";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";

export function ActiveStyleProvider({
  unstyled,
  ...props
}: Omit<React.ComponentProps<"div">, "style"> & { unstyled?: boolean }) {
  const container = useActiveStylePortalContext();
  const { activeMode } = usePreferences();
  const { data: activeStyle, isPending, isError } = useActiveStyle();

  if (isPending) {
    return (
      <Skeleton {...props} className={cn("rounded-none", props.className)}>
        {props.children}
      </Skeleton>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-4">
        <Alert
          variant="danger"
          title="An error occurred while loading the style."
        />
      </div>
    );
  }

  return (
    <StyleProvider
      mode={activeMode}
      style={activeStyle}
      unstyled={unstyled}
      {...props}
    >
      <PortalProvider getContainer={() => container.current}>
        {props.children}
      </PortalProvider>
    </StyleProvider>
  );
}

const ActiveStyleContext =
  React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);

const useActiveStylePortalContext = () => {
  const context = React.useContext(ActiveStyleContext);
  if (!context) {
    throw new Error(
      "useCurrentStylePortalContext must be used within a CurrentStylePortalProvider",
    );
  }
  return context;
};

export const ActiveStylePortalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const container = React.useRef<HTMLDivElement>(null);
  const { activeMode } = usePreferences();
  const { data: activeStyle } = useActiveStyle();

  return (
    <ActiveStyleContext.Provider value={container}>
      <StyleProvider
        ref={container}
        mode={activeMode}
        style={activeStyle}
        unstyled
      />
      {children}
    </ActiveStyleContext.Provider>
  );
};
