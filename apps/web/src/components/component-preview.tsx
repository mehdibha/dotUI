"use client";

import React from "react";
import { CodeBlock } from "@/components/code-block";
import { useConfig } from "@/hooks/use-config";
import { styles } from "@/registry/styles";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { cn } from "@/registry/ui/default/lib/cn";

export interface ComponentPreviewProps {
  name: string;
  className?: string;
  containerClassName?: string;
  aspect?: "default" | "page";
  defaultExpanded?: boolean;
  preview?: string;
  expandable?: boolean;
}

export const ComponentPreview = ({
  name,
  className,
  containerClassName,
  aspect = "default",
  preview,
  expandable,
}: ComponentPreviewProps) => {
  const config = useConfig();
  const index = styles.findIndex((style) => style.name === config.style);

  const component = React.useMemo(() => {
    // const Component = Index[config.style][name]?.component;
    const Component = false

    if (!Component) {
      return <p className="text-sm text-fg-muted">Component not found.</p>;
    }

    // return <Component />;
  }, [name]);

  // const code = React.useMemo(() => {
  //   const allCodeFiles = previews[name]?.code ?? [];

  //   if (allCodeFiles.length === 0) {
  //     return [];
  //   }

  //   return allCodeFiles.map((file) => ({
  //     ...file,
  //     code: file.code.replace("export default function", "function"),
  //   }));
  // }, [name]);

  return (
    <div className={cn("overflow-hidden rounded-md border", containerClassName)}>
      <div className="relative">
        <ScrollArea
          className={cn("flex items-center justify-center bg-white dark:bg-black", {
            "max-h-[800px]": aspect === "default",
          })}
        >
          <div className="min-h-40 flex items-center justify-center px-4 py-8">
            <div className={cn("flex w-full items-center justify-center", className)}>
              {component}
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* <CodeBlock
        files={code.map((file) => ({
          fileName: file.title,
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
