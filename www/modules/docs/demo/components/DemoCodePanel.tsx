"use client";

import type React from "react";
import { ViewTransition } from "react";

import { CodeBlock } from "@/modules/docs/code-block";
import { DynamicCodeBlock } from "@/modules/docs/dynamic-code-block";
import { DemoActions } from "./DemoActions";

interface DemoCodePanelProps {
  highlightedCode?: React.ReactNode;
  highlightedPreview?: React.ReactNode;
  previewSource?: string;
  codeSource?: string;
  dynamicPreview?: string;
  dynamicCode?: string;
  hasControls: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const DemoCodePanel = ({
  highlightedCode,
  highlightedPreview,
  previewSource,
  codeSource,
  dynamicPreview,
  dynamicCode,
  hasControls,
  isExpanded,
  onToggleExpanded,
}: DemoCodePanelProps) => {
  const previewContent =
    hasControls && previewSource ? (
      <DynamicCodeBlock
        code={(dynamicPreview ?? previewSource).trim()}
        lang="tsx"
        fallback={highlightedPreview}
      />
    ) : (
      highlightedPreview
    );

  const codeContent =
    hasControls && codeSource ? (
      <DynamicCodeBlock
        code={(dynamicCode ?? codeSource).trim()}
        lang="tsx"
        fallback={highlightedCode}
      />
    ) : (
      highlightedCode
    );

  return (
    <CodeBlock
      className="rounded-t-none border-t-0"
      actions={
        <DemoActions
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
      }
    >
      <ViewTransition default="code-fade">
        {isExpanded ? codeContent : previewContent}
      </ViewTransition>
    </CodeBlock>
  );
};
