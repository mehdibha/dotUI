import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PaintBucket } from "lucide-react";
import { cn } from "@/lib/cn";
import { getFileSource } from "@/lib/get-file-source";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/core/button";
import { Tooltip } from "@/components/core/tooltip";
import { Index } from "@/__registry__/demos";
import { ComponentPreviewClient } from "./component-preview-client";
import { StyleSwitcher } from "./style-switcher";
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
  expandable = true,
}: ComponentPreviewProps) => {
  const type = name.split("/")[0];
  const componentName = name.split("/")[1];
  const demoName = name.split("/")[2];

  const demoItem = Index[type][demoName];

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
          <StyleSwitcher componentName={componentName} />
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
          <ScrollArea
            className={cn("flex items-center justify-center", "bg-bg text-fg")}
          >
            <div className="flex min-h-52 items-center justify-center px-4 py-20">
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
