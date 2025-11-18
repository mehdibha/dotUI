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

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";
import { CodeBlock } from "./code-block";
import {
  buildControlDefaults,
  type ComponentPreviewControl,
  ComponentPreviewControls,
  type ControlValue,
} from "./component-preview-controls";

interface ComponentPreviewTabsProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  code?: React.ReactNode;
  preview?: React.ReactNode;
  controls?: ComponentPreviewControl[];
}

export type { ComponentPreviewControl };

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
  const hasControls = Boolean(controls?.length);

  const [controlValues, setControlValues] = React.useState<
    Record<string, ControlValue>
  >(() => buildControlDefaults(controls));

  const controlsSignature = React.useMemo(
    () => (hasControls ? JSON.stringify(controls) : undefined),
    [controls, hasControls],
  );

  const previousControlsSignature = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (controlsSignature === previousControlsSignature.current) {
      return;
    }

    previousControlsSignature.current = controlsSignature;
    setControlValues(buildControlDefaults(controls));
  }, [controls, controlsSignature]);

  const computedControlProps = React.useMemo(() => {
    if (!hasControls) {
      return undefined;
    }

    return Object.entries(controlValues).reduce<Record<string, ControlValue>>(
      (acc, [key, value]) => {
        if (typeof value !== "undefined") {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );
  }, [controlValues, hasControls]);

  const renderedComponent = React.useMemo(() => {
    if (!hasControls || !computedControlProps) {
      return component;
    }

    if (!React.isValidElement(component)) {
      return component;
    }

    return React.cloneElement(component, computedControlProps);
  }, [component, computedControlProps, hasControls]);

  const handleControlChange = React.useCallback(
    (name: string, value: ControlValue) => {
      setControlValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

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

          {renderedComponent}
        </div>
        {hasControls && controls && (
          <ComponentPreviewControls
            controls={controls}
            values={controlValues}
            onValueChange={handleControlChange}
          />
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
