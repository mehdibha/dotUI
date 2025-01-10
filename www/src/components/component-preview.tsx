import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDownIcon, PaintBucket } from "lucide-react";
import { cn } from "@/lib/cn";
import { getFileSource } from "@/lib/get-file-source";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/core/button";
import { ListBox, Item } from "@/components/core/list-box";
import { Overlay } from "@/components/core/overlay";
import { Select, SelectRoot, SelectValue } from "@/components/core/select";
import { Tooltip } from "@/components/core/tooltip";
import { core } from "@/registry/registry-core";
import { RegistryItem } from "@/registry/types";
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
  const compName = "button";
  const variants = getAllComponentVariants(compName);

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
          <SelectRoot defaultSelectedKey="alert-01">
            <Button
              variant="outline"
              size="sm"
              suffix={<ChevronDownIcon />}
              className="border-border absolute left-2 top-2 z-50 text-xs font-normal"
            >
              <span className="font-bold">variant:</span> <SelectValue />
            </Button>
            <Overlay type="popover">
              <ListBox>
                {variants &&
                  variants.map((item) => (
                    <Item key={item.name} id={item.name} description={item.description}>
                      {item.name} {false && "(current theme)"}
                    </Item>
                  ))}
              </ListBox>
            </Overlay>
          </SelectRoot>
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
            <div className="flex min-h-52 items-center justify-center px-4 py-16">
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

const getAllComponentVariants = (name: string) => {
  const item = core.find((item) => item.name === name);

  if (hasVariants(item)) {
    return item.variants;
  } else {
    return false;
  }
};

function hasVariants(
  item?: RegistryItem
): item is Extract<RegistryItem, { variants: unknown }> {
  return item !== undefined && "variants" in item;
}
