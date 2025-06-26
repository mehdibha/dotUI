import React from "react";
import { CodeBlock } from "@/modules/docs/components/code-block";
import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { Index } from "@dotui/ui/__registry__/demos";
import { cn } from "@dotui/ui/lib/utils";

import {
  ComponentPreviewHeader,
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

  // const code: { fileName: string; code: string }[] = demoItem.files.map(
  //   (file: string) => {
  //     const { fileName, content } = getFileSource(file);
  //     return {
  //       fileName,
  //       code: content,
  //     };
  //   },
  // );

  return (
    <div
      className={cn("overflow-hidden rounded-md border", containerClassName)}
    >
      <div className="bg-bg-muted">
        <ResizableContainer resizable={resizable}>
          <Loader>
            <div className="relative duration-300">
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
                    <ComponentWrapper suspense={suspense}>
                      <Component />
                    </ComponentWrapper>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </Loader>
        </ResizableContainer>
      </div>
      {/* <CodeBlock
        files={code.map((file) => ({
          fileName: file.fileName,
          code: file.code,
          lang: "tsx",
        }))}
        preview={preview}
        className={"w-full rounded-t-none border-x-0 border-b-0"}
        expandable={expandable}
      /> */}
    </div>
  );
};
