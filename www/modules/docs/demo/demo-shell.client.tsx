"use client";

import React, { startTransition } from "react";

import { cn } from "@dotui/registry/lib/utils";

import type { DemoControl } from "@/modules/docs/component-controls";
import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { DemoCodePanel } from "./components/DemoCodePanel";
import { DemoControlsPanel } from "./components/DemoControlsPanel";
import { DemoPreviewFrame } from "./components/DemoPreviewFrame";
import { useDemoControls } from "./hooks/use-demo-controls";

interface DemoShellProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  highlightedCode?: React.ReactNode;
  codeSource?: string;
  highlightedPreview?: React.ReactNode;
  previewSource?: string;
  controls?: DemoControl[];
}

export const DemoShell = ({
  component,
  highlightedCode,
  codeSource,
  highlightedPreview,
  previewSource,
  controls,
  className,
  ...props
}: DemoShellProps) => {
  const {
    hasControls,
    controlValues,
    renderedComponent,
    previewSourceForBlocks,
    codeSourceForBlocks,
    handleControlChange,
  } = useDemoControls({ component, controls, codeSource, previewSource });

  const [isExpanded, setExpanded] = React.useState(false);
  const toggleExpanded = React.useCallback(() => {
    startTransition(() => {
      setExpanded((previous) => !previous);
    });
  }, []);

  return (
    <div className={cn("", className)} {...props}>
      <ActiveStyleProvider
        unstyled
        className="flex min-h-56 items-stretch"
        skeletonClassName="border rounded-t-md"
      >
        <DemoPreviewFrame>{renderedComponent}</DemoPreviewFrame>
        {hasControls && controls && (
          <DemoControlsPanel
            controls={controls}
            values={controlValues}
            onValueChange={handleControlChange}
          />
        )}
      </ActiveStyleProvider>
      <DemoCodePanel
        isExpanded={isExpanded}
        onToggleExpanded={toggleExpanded}
        highlightedCode={highlightedCode}
        highlightedPreview={highlightedPreview}
        hasControls={hasControls}
        previewSource={previewSource}
        codeSource={codeSource}
        dynamicPreview={previewSourceForBlocks}
        dynamicCode={codeSourceForBlocks}
      />
    </div>
  );
};
