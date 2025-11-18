"use client";

import React, { startTransition, ViewTransition } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";
import { CodeBlock } from "./code-block";

interface ComponentPreviewTabsProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  code?: React.ReactNode;
  preview?: React.ReactNode;
  controls?: { name: string; type: string; defaultValue: any }[];
}

export function ComponentPreviewTabs({
  component,
  className,
  code,
  preview,
  controls,
  ...props
}: ComponentPreviewTabsProps) {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: style } = useActiveStyle();
  const isMounted = useMounted();
  const [isExpanded, setExpanded] = React.useState(false);

  return (
    <div className={cn("", className)} {...props}>
      <ActiveStyleProvider className="flex items-stretch">
        <div className="relative z-1 flex min-h-48 flex-1 items-center justify-center rounded-t-lg border bg-bg pt-24 pb-20">
          <ActiveStyleSelector
            buttonProps={{
              size: "sm",
              variant: "quiet",
              className: "text-xs h-7 border-0 absolute left-1.5 top-1.5",
            }}
          />
          {style && style.theme.colors.activeModes.length > 1 && isMounted && (
            <Button
              size="sm"
              variant="quiet"
              className="absolute top-1.5 right-1.5 size-7! border-0"
              onPress={() =>
                setActiveMode(activeMode === "dark" ? "light" : "dark")
              }
            >
              {activeMode === "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
          )}

          {component}
        </div>
        {controls && (
          <div className="-ml-2 w-32 space-y-2 rounded-tr-md border border-l-0 bg-card/50 p-3 pl-5 **:data-[slot=label]:text-xs">
            <Select defaultValue="primary" className="w-full">
              <Label>Variant</Label>
              <SelectTrigger
                size="sm"
                className="h-7 w-full border-0 text-xs"
              />
              <SelectContent>
                <SelectItem id="primary">Primary</SelectItem>
                <SelectItem id="secondary">Secondary</SelectItem>
                <SelectItem id="quiet">Quiet</SelectItem>
                <SelectItem id="link">Link</SelectItem>
                <SelectItem id="danger">Danger</SelectItem>
                <SelectItem id="success">Success</SelectItem>
                <SelectItem id="warning">Warning</SelectItem>
                <SelectItem id="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Label>isPending</Label>
              <Switch size="sm" />
            </div>
            <div>
              <Label>isDisabled</Label>
              <Switch size="sm" />
            </div>
          </div>
        )}
      </ActiveStyleProvider>
      <CodeBlock
        className="rounded-t-none border-t-0"
        // title="Code"
        actions={
          <Button
            variant="quiet"
            size="sm"
            className="h-7 gap-1 pr-2 pl-1 text-xs"
            onPress={() => {
              startTransition(() => {
                setExpanded(!isExpanded);
              });
            }}
          >
            {isExpanded && (
              <>
                <ChevronUpIcon /> Collapse
              </>
            )}
            {!isExpanded && (
              <>
                <ChevronDownIcon /> Expand
              </>
            )}
          </Button>
        }
      >
        <ViewTransition default="code-fade">
          {isExpanded ? code : preview}
        </ViewTransition>
      </CodeBlock>
    </div>
  );
}
