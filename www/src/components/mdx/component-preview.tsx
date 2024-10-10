import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { getFileSource } from "@/lib/get-file-source";
import { CodeBlock } from "@/components/code-block";
import { styles } from "@/registry/styles";
import { cn } from "@/registry/ui/default/lib/cn";
import { Index } from "@/__demos__";
import { ComponentPreviewClient } from "./component-preview-client";

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

  if (type === "core") {
    const demos: {
      component: React.ComponentType;
      code: Array<{
        fileName: string;
        code: string;
      }>;
    }[] = styles.map((style) => {
      const demo = Index["core"][style.name][componentName];
      return {
        component: demo.component,
        code: demo.files.map((file: string) => {
          const { fileName, content } = getFileSource(file);
          return {
            fileName,
            code: content,
          };
        }),
      };
    });

    return (
      <div
        className={cn("overflow-hidden rounded-md border", containerClassName)}
      >
        <div className="relative">
          <ScrollArea
            className={cn(
              "flex items-center justify-center bg-white dark:bg-black"
            )}
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
  }

  // TODO: handle other component types
  return (
    <p className="text-fg-muted text-sm">Component type {type} not handled.</p>
  );
};
