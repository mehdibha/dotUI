"use client";

import React from "react";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";

import { DemoCodeBlock } from "./demo-code-block";
import { DemoFrame } from "./demo-frame";

interface DemoClientProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  highlightedPreview: React.ReactNode;
  highlightedSource: React.ReactNode;
  previewClassName?: string;
}

const DemoContext = React.createContext<{
  isExpanded: boolean;
  toggleExpanded: () => void;
} | null>(null);

export const DemoClient = ({
  component,
  highlightedPreview,
  highlightedSource,
  previewClassName,
  ...props
}: DemoClientProps) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const toggleExpanded = React.useCallback(() => {
    React.startTransition(() => {
      setExpanded((prev) => !prev);
    });
  }, []);

  return (
    <DemoContext.Provider value={{ isExpanded, toggleExpanded }}>
      <div {...props}>
        <ActiveStyleProvider
          unstyled
          className="flex items-stretch text-fg"
          skeletonClassName="rounded-t-md border"
        >
          <DemoFrame className={previewClassName}>{component}</DemoFrame>
        </ActiveStyleProvider>
        <DemoCodeBlock
          highlightedPreview={highlightedPreview}
          highlightedSource={highlightedSource}
        />
      </div>
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const ctx = React.useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemoContext must be used within DemoClient");
  }
  return ctx;
};
