import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SlidersHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Index } from "@/__registry__/demos";
import { CodeBlock } from "@/modules/docs/components/code-block";
import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { CurrentThemeProvider } from "@/modules/styles/components/current-style-provider";
import {
  ComponentWrapper,
  Loader,
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
  suspense = false,
  primary = false,
}: ComponentPreviewProps) => {
  const demoItem = Index[name];

  // @ts-expect-error TODO fix later
  const Component = demoItem.component;
  // @ts-expect-error TODO fix later
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
      <div className="bg-bg-muted">
        <ResizableContainer resizable={resizable}>
          <Loader>
            <CurrentThemeProvider className="relative duration-300">
              <Button
                variant="quiet"
                shape="square"
                size="sm"
                className="absolute right-2 top-2 z-10"
              >
                <SlidersHorizontalIcon />
              </Button>
              <ScrollArea className="bg-bg text-fg">
                <div
                  className={cn(
                    "flex py-10",
                    primary && "min-h-48 py-20",
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
            </CurrentThemeProvider>
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
