"use client";

import React from "react";

import { cn } from "@dotui/registry/lib/utils";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { DemoCodeBlock } from "./demo-code-block";
import { DemoControls } from "./demo-controls";
import { DemoFrame } from "./demo-frame";
import type { ControlValue, DemoControlsMap, NormalizedDemoControl } from "./types";
import { useControlsState } from "./use-controls-state";

interface DemoClientProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  source: string;
  highlightedSource: React.ReactNode;
  preview: string;
  highlightedPreview: React.ReactNode;
  controls: DemoControlsMap;
}

interface DemoContextValue {
  controls: DemoControlsMap;
  controlList: NormalizedDemoControl[];
  controlValues: Record<string, ControlValue>;
  hasControls: boolean;
  dynamicPreview?: string;
  dynamicSource?: string;
  shareableSearch: string;
  handleValueChange: (name: string, value: ControlValue) => void;
  isExpanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const DemoContext = React.createContext<DemoContextValue | null>(null);

export function DemoClient({
  component,
  controls,
  source,
  highlightedSource,
  preview,
  highlightedPreview,
  className,
  ...props
}: DemoClientProps) {
  const {
    controls: resolvedControls,
    controlList,
    controlValues,
    hasControls,
    renderedComponent,
    dynamicPreview,
    dynamicSource,
    shareableSearch,
    handleValueChange,
  } = useControlsState({
    component,
    controls,
    preview,
    source,
  });

  const [isExpanded, setExpanded] = React.useState(false);

  const contextValue = React.useMemo<DemoContextValue>(
    () => ({
      controls: resolvedControls,
      controlList,
      controlValues,
      hasControls,
      dynamicPreview,
      dynamicSource,
      shareableSearch,
      handleValueChange,
      isExpanded,
      setExpanded,
    }),
    [
      controlList,
      controlValues,
      dynamicPreview,
      dynamicSource,
      handleValueChange,
      hasControls,
      isExpanded,
      resolvedControls,
      shareableSearch,
    ],
  );

  return (
    <DemoContext.Provider value={contextValue}>
      <div className={cn(className)} {...props}>
        <ActiveStyleProvider
          unstyled
          className="flex min-h-56 items-stretch"
          skeletonClassName="border rounded-t-md"
        >
          <DemoFrame>{renderedComponent}</DemoFrame>
          {hasControls ? <DemoControls /> : null}
        </ActiveStyleProvider>
        <DemoCodeBlock
          source={source}
          preview={preview}
          highlightedSource={highlightedSource}
          highlightedPreview={highlightedPreview}
        />
      </div>
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemoContext must be used within DemoClient.");
  }
  return ctx;
}
