"use client";

import type React from "react";
import { ViewTransition } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { CodeBlock } from "@/modules/docs/code-block";
import { useDemoContext } from "./demo.client";

interface DemoCodeBlockProps {
  highlightedPreview: React.ReactNode;
  highlightedSource: React.ReactNode;
}

export const DemoCodeBlock = ({
  highlightedPreview,
  highlightedSource,
}: DemoCodeBlockProps) => {
  const { isExpanded, toggleExpanded } = useDemoContext();

  return (
    <CodeBlock
      className="rounded-t-none border-t-0"
      actions={
        <Button
          variant="quiet"
          size="sm"
          className="h-7 gap-1 pr-2 pl-1 text-xs"
          onPress={toggleExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon /> Code
            </>
          ) : (
            <>
              <ChevronDownIcon /> Code
            </>
          )}
        </Button>
      }
    >
      <ViewTransition default="code-fade">
        {isExpanded ? highlightedSource : highlightedPreview}
      </ViewTransition>
    </CodeBlock>
  );
};
