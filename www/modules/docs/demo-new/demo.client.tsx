"use client";

import React from "react";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { DemoCodeBlock } from "./demo-code-block";
import { DemoControls } from "./demo-controls";
import { DemoFrame } from "./demo-frame";
import type { DemoControl } from "./types";

interface DemoClientProps {
  component: React.ReactNode;
  source: string;
  highlightedSource: React.ReactNode;
  preview: string;
  highlightedPreview: React.ReactNode;
  controls?: DemoControl[];
}

export function DemoClient({
  component,
  controls,
  ...sourceProps
}: DemoClientProps) {
  return (
    <DemoRoot>
      <DemoPreview>
        <DemoFrame>{component}</DemoFrame>
        <DemoControls />
      </DemoPreview>
      <DemoCodeBlock {...sourceProps} />
    </DemoRoot>
  );
}

const DemoRoot = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setExpanded] = React.useState(false);
  return (
    <DemoContext.Provider value={{ isExpanded, setExpanded }}>
      <div>{children}</div>
    </DemoContext.Provider>
  );
};

const DemoPreview = ({ children }: { children: React.ReactNode }) => {
  return (
    <ActiveStyleProvider unstyled className="flex min-h-56 items-stretch">
      {children}
    </ActiveStyleProvider>
  );
};

interface DemoContextType {
  isExpanded: boolean;
  setExpanded: (isExpanded: boolean) => void;
}

const DemoContext = React.createContext<DemoContextType>({
  isExpanded: false,
  setExpanded: () => {},
});

export function useDemoContext() {
  return React.use(DemoContext);
}
