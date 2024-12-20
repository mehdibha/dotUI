import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader2Icon, PaintBucket } from "lucide-react";
import { cn } from "@/lib/cn";
import { getFileSource } from "@/lib/get-file-source";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/core/button";
import { Tooltip } from "@/components/core/tooltip";
import { Skeleton } from "@/__registry__/core/skeleton-01";
import { Index } from "@/__registry__/demos";
import { ComponentPreviewClient } from "./component-preview-client";
import { ThemeCustomizerDialog } from "./theme-customizer";
import { ThemeOverride } from "./theme-override";

export interface ComponentPreviewProps {
  name: string;
  containerClassName?: string;
  className?: string;
  preview?: string;
  expandable?: boolean;
}

export const ComponentPreview = async ({
  name,
  containerClassName,
  className,
  preview,
  expandable,
}: ComponentPreviewProps) => {
  const type = name.split("/")[0];
  const componentName = name.split("/")[1];

  const demoItem = Index[type][componentName];

  const demos: {
    component: React.ComponentType;
    code: Array<{
      fileName: string;
      code: string;
    }>;
  }[] = [
    {
      component: demoItem.component,
      code: demoItem.files.map((file: string) => {
        const { fileName, content } = getFileSource(file);
        return {
          fileName,
          code: content,
        };
      }),
    },
  ];

  return (
    <div
      className={cn("overflow-hidden rounded-md border", containerClassName)}
    >
      <div className="relative">
        <ThemeOverride>
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
                className="absolute right-2 top-2 z-50 font-normal"
              >
                <PaintBucket />
              </Button>
            </Tooltip>
          </ThemeCustomizerDialog>
          <ScrollArea
            className={cn("flex items-center justify-center", "bg-bg text-fg")}
          >
            <div className="flex min-h-40 items-center justify-center px-4 py-8">
              <div
                className={cn(
                  "flex w-full items-center justify-center",
                  className
                )}
              >
                <ComponentPreviewClient
                  demos={demos.map((elem, index) => {
                    const Comp = elem.component;
                    return <Comp key={index} />;
                  })}
                />
              </div>
            </div>
          </ScrollArea>
        </ThemeOverride>
      </div>
      <ComponentPreviewClient
        demos={demos.map((elem, index) => {
          return (
            <CodeBlock
              key={index}
              files={elem.code.map((file) => ({
                fileName: file.fileName,
                code: file.code,
                lang: "tsx",
              }))}
              preview={preview}
              className={"w-full rounded-t-none border-x-0 border-b-0"}
              expandable={expandable}
            />
          );
        })}
      />
    </div>
  );
};
