import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  // PaintBucket,
  // Settings2Icon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { getFileSource } from "@/lib/get-file-source";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
// import { Tooltip } from "@/components/core/tooltip";
import { CodeBlock } from "@/components/docs/code-block";
import { Index } from "@/__registry__/demos";
import {
  ComponentWrapper,
  Loader,
  ResizableContainer,
} from "./component-preview-client";
// import { StyleSwitcher } from "./style-switcher";
// import { ThemeCustomizerDialog } from "./theme-customizer";
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
      {/* <div className="bg-bg-muted flex items-center justify-between rounded-t-[inherit] border-b p-2">
        <StyleSwitcher
          // @ts-expect-error TODO fix later
          componentName={getComponentName(name)}
          variant="outline"
          className="bg-bg-inverse/5 h-7 text-xs font-normal"
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
              className="bg-bg-inverse/5 size-7 text-sm font-normal"
            >
              <PaintBucket />
            </Button>
          </Tooltip>
        </ThemeCustomizerDialog>
      </div> */}
      <div className="bg-bg-muted">
        <ResizableContainer resizable={resizable}>
          <Loader>
            <ThemeOverride className="relative duration-300">
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

// const getComponentName = (name: string) => {
//   const groupName = name.split("/")[0];
//   if (groupName === "range-calendar") return "calendar";
//   return groupName;
// };
