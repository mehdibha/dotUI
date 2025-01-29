import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PaintBucket } from "lucide-react";
import { cn } from "@/lib/cn";
import { getFileSource } from "@/lib/get-file-source";
import { Button } from "@/components/core/button";
import { Tooltip } from "@/components/core/tooltip";
import { CodeBlock } from "@/components/docs/code-block";
import { Index } from "@/__registry__/demos";
import {
  ComponentWrapper,
  Loader,
  ResizableContainer,
} from "./component-preview-client";
import { StyleSwitcher } from "./style-switcher";
import { ThemeCustomizerDialog } from "./theme-customizer";
import { ThemeOverride } from "./theme-override";

export interface ComponentPreviewProps {
  name: string;
  containerClassName?: string;
  className?: string;
  preview?: string;
  expandable?: boolean;
  fullWidth?: boolean;
  resizable?: boolean;
  suspense?: boolean;
}

export const ComponentPreview = async ({
  name,
  containerClassName,
  preview,
  expandable = true,
  fullWidth = false,
  resizable = false,
  suspense = false,
}: ComponentPreviewProps) => {
  const type = name.split("/")[0];
  const componentName = name.split("/")[1];
  const demoName = name.split("/")[2];

  const demoItem = Index[type][demoName];

  const Component = demoItem.component;
  const code: { fileName: string; code: string }[] = demoItem.files.map(
    (file: string) => {
      const { fileName, content } = getFileSource(file);
      return {
        fileName,
        code: content,
      };
    }
  );

  return (
    <div
      className={cn("overflow-hidden rounded-md border", containerClassName)}
    >
      <div className="bg-bg-muted relative">
        <StyleSwitcher
          componentName={
            componentName === "range-calendar" ? "calendar" : componentName
          }
        />
        <ThemeCustomizerDialog>
          <Tooltip
            content={
              <span>
                <span className="text-fg-muted">Theme:</span> dotUI
              </span>
            }
          >
            <Button
              variant="outline"
              shape="square"
              size="sm"
              className="border-border absolute right-2 top-2 z-50 font-normal"
            >
              <PaintBucket />
            </Button>
          </Tooltip>
        </ThemeCustomizerDialog>
        <ResizableContainer resizable={resizable}>
          <Loader>
            <ThemeOverride>
              <ScrollArea className="bg-bg text-fg">
                <div
                  className={cn(
                    "flex min-h-52 py-20",
                    fullWidth
                      ? "px-8 lg:px-12"
                      : "flex items-center justify-center px-4"
                  )}
                >
                  <div
                    className={cn(
                      fullWidth ? "w-full" : "flex items-center justify-center"
                    )}
                  >
                    <ComponentWrapper suspense={suspense}>
                      <Component />
                    </ComponentWrapper>
                  </div>
                </div>
              </ScrollArea>
            </ThemeOverride>
          </Loader>
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
