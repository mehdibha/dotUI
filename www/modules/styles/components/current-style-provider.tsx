"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/ui";
import { Alert } from "@dotui/ui/components/alert";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { useTRPC } from "@/lib/trpc/react";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export function CurrentStyleProvider(
  props: Omit<React.ComponentProps<"div">, "style">,
) {
  const { currentMode, currentStyleSlug } = usePreferences();
  const container = useCurrentStylePortalContext();

  const trpc = useTRPC();

  const { data: currentStyleFromAPI } = useQuery({
    ...trpc.style.getCurrentStyle.queryOptions(),
    retry: false,
  });

  const selectedStyle = currentStyleFromAPI || currentStyleSlug;

  const {
    data: style,
    isLoading,
    isError,
  } = useQuery({
    ...trpc.style.bySlug.queryOptions({
      slug: selectedStyle,
    }),
    enabled: !!selectedStyle,
    placeholderData: (prev) => prev,
  });

  if (isLoading) {
    return <Skeleton>{props.children}</Skeleton>;
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
    <StyleProvider mode={currentMode} style={style} {...props}>
      <PortalProvider getContainer={() => container.current}>
        {props.children}
      </PortalProvider>
    </StyleProvider>
  );
}

const CurrentStyleContext =
  React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);

const useCurrentStylePortalContext = () => {
  const context = React.useContext(CurrentStyleContext);
  if (!context) {
    throw new Error(
      "useCurrentStylePortalContext must be used within a CurrentStylePortalProvider",
    );
  }
  return context;
};

export const CurrentStylePortalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const container = React.useRef<HTMLDivElement>(null);
  const { currentMode, currentStyleSlug } = usePreferences();

  const trpc = useTRPC();

  const { data: currentStyleFromAPI } = useQuery({
    ...trpc.style.getCurrentStyle.queryOptions(),
    retry: false,
  });

  const selectedStyle = currentStyleFromAPI || currentStyleSlug;

  const { data: style } = useQuery({
    ...trpc.style.bySlug.queryOptions({
      slug: selectedStyle,
    }),
    enabled: !!selectedStyle,
    placeholderData: (prev) => prev,
  });

  return (
    <CurrentStyleContext.Provider value={container}>
      <StyleProvider
        ref={container}
        mode={currentMode}
        style={style}
        unstyled
      />
      <PortalProvider getContainer={() => container.current}>
        {children}
      </PortalProvider>
    </CurrentStyleContext.Provider>
  );
};
