import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { cn } from "@dotui/registry/lib/utils";
import { Alert } from "@dotui/registry/ui/alert";
import { Index } from "@dotui/registry/ui/demos";

import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { CodeBlock } from "./code-block";
import {
  ComponentPreviewHeader,
  ResizableContainer,
} from "./component-preview-client";

export interface ComponentPreviewProps {
  name: string;
  containerClassName?: string;
  className?: string;
  preview?: string;
  expandable?: boolean;
  fullWidth?: boolean;
  resizable?: boolean;
  suspense?: boolean;
  primary?: boolean;
}

export const ComponentPreview = async ({
  name,
  containerClassName,
  preview,
  expandable = true,
  fullWidth = false,
  resizable = false,
  primary = false,
}: ComponentPreviewProps) => {
  const demoItem = Index[name];

  if (!demoItem) {
    return (
      <div
        className={cn("flex items-center justify-center", containerClassName)}
      >
        <Alert>Preview not found</Alert>
      </div>
    );
  }

  const Component = demoItem.component;

  const code: { fileName: string; code: string }[] = demoItem.files.map(
    (file: string) => {
      const { fileName, content } = getFileSource(file);
      return {
        fileName,
        code: content,
      };
    },
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border",
        containerClassName,
      )}
    >
      <div className="bg-muted">
        <ResizableContainer resizable={resizable}>
          <ActiveStyleProvider>
            <ComponentPreviewHeader />
            <ScrollArea className="bg-bg text-fg">
              <div
                className={cn(
                  "flex pt-14 pb-10",
                  primary && "min-h-48 pt-24 pb-20",
                  fullWidth
                    ? "px-8 lg:px-12"
                    : "flex items-center justify-center px-4",
                )}
              >
                <div
                  className={cn(
                    fullWidth ? "w-full" : "flex items-center justify-center",
                  )}
                >
                  <Component />
                </div>
              </div>
            </ScrollArea>
          </ActiveStyleProvider>
        </ResizableContainer>
      </div>
      <CodeBlock
        files={code.map((file) => ({
          fileName: file.fileName,
          code: file.code,
          lang: "tsx",
        }))}
        preview={preview}
        className={"w-full rounded-t-none border-x-0 border-b-0"}
        expandable={expandable}
      />
    </div>
  );
};
