"use client";

import React from "react";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { DemoCodeBlock } from "./demo-code-block";
import { DemoFrame } from "./demo-frame";

interface DemoClientProps {
  component: React.ReactNode;
  highlightedPreview: React.ReactNode;
  highlightedSource: React.ReactNode;
}

const DemoContext = React.createContext<{
  isExpanded: boolean;
  toggleExpanded: () => void;
} | null>(null);

export const DemoClient = ({
  component,
  highlightedPreview,
  highlightedSource,
}: DemoClientProps) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const toggleExpanded = React.useCallback(
    () => setExpanded((prev) => !prev),
    [],
  );

  return (
    <DemoContext.Provider value={{ isExpanded, toggleExpanded }}>
      <ActiveStyleProvider
        unstyled
        className="flex min-h-56 items-stretch"
        skeletonClassName="border rounded-t-md"
      >
        <DemoFrame>{component}</DemoFrame>
      </ActiveStyleProvider>
      <DemoCodeBlock
        highlightedPreview={highlightedPreview}
        highlightedSource={highlightedSource}
      />
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
