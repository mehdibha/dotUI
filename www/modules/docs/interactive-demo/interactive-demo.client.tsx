"use client";

import React, {
  type ComponentType,
  createElement,
  Suspense,
  useCallback,
  useMemo,
  useState,
  ViewTransition,
} from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Columns2Icon,
  Rows2Icon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";
import type { Control, ControlValues } from "@dotui/registry/playground";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";

import { CodeBlock, DynamicPre } from "../code-block";
import { DemoFrame } from "../demo/demo-frame";
import { availableIcons, Controls } from "./controls";
import { elementToCode, elementToPreviewCode } from "./element-to-code";

/**
 * Interactive demo client component.
 * Renders the playground, controls, and live code output.
 */

interface InteractiveDemoClientProps {
  component: ComponentType<Record<string, unknown>>;
  controls: Control[];
  className?: string;
  fallback: React.ReactNode;
  layout?: "horizontal" | "vertical";
}

export function InteractiveDemoClient({
  component: Playground,
  controls,
  className,
  fallback,
  layout: layoutProp = "horizontal",
}: InteractiveDemoClientProps) {
  const [layout, setLayout] = React.useState<"horizontal" | "vertical">(
    layoutProp,
  );
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Initialize values from control defaults
  const initialValues = useMemo(() => {
    const values: ControlValues = {};
    for (const control of controls) {
      values[control.name] = getDefaultValue(control);
    }
    return values;
  }, [controls]);

  const [values, setValues] = useState<ControlValues>(initialValues);

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Convert icon names to actual icon elements for preview
  const propsWithIcons = useMemo(() => {
    const props: Record<string, unknown> = { ...values };

    for (const control of controls) {
      if (control.type === "icon") {
        const iconName = values[control.name] as string | null;
        if (iconName && availableIcons[iconName]) {
          // Create the icon element for preview
          props[control.name] = createElement(availableIcons[iconName], {
            className: "size-4",
          });
        } else {
          props[control.name] = null;
        }
      }
    }

    return props;
  }, [values, controls]);

  // Create props for code generation (excludes default values unless alwaysShow)
  const propsForCode = useMemo(() => {
    const props: Record<string, unknown> = {};

    for (const control of controls) {
      const value = values[control.name];
      const defaultValue = getDefaultValue(control);
      const shouldShow = control.alwaysShow || !isEqual(value, defaultValue);

      if (shouldShow) {
        if (control.type === "icon") {
          const iconName = value as string | null;
          if (iconName && availableIcons[iconName]) {
            props[control.name] = createElement(availableIcons[iconName], {
              className: "size-4",
            });
          }
        } else {
          props[control.name] = value;
        }
      }
    }

    return props;
  }, [values, controls]);

  // Render the playground element for preview (uses ALL props)
  const previewElement = useMemo(
    () => createElement(Playground, propsWithIcons),
    [Playground, propsWithIcons],
  );

  // Call the playground function to get what it actually renders (for code serialization)
  // This gives us <TextField>...</TextField> instead of <Playground ...>
  // Uses filtered props to hide default values from code output
  const renderedElement = useMemo(() => {
    // All playground components are function components, so we can call them directly
    const PlaygroundFn = Playground as (
      props: Record<string, unknown>,
    ) => React.ReactElement;
    return PlaygroundFn(propsForCode);
  }, [Playground, propsForCode]);

  // Generate code by serializing the rendered element
  const codeOutput = useMemo(
    () => elementToCode(renderedElement),
    [renderedElement],
  );
  const previewCode = useMemo(
    () => elementToPreviewCode(renderedElement),
    [renderedElement],
  );

  // Displayed code depends on expanded state
  const displayedCode = isExpanded ? codeOutput.full : previewCode;

  return (
    <div className={cn("", className)}>
      <div
        className={cn("flex flex-col", layout === "horizontal" && "flex-row")}
      >
        <ActiveStyleProvider
          unstyled
          className="flex min-h-56 flex-1 items-stretch text-fg"
          skeletonClassName="z-1 rounded-t-md border"
        >
          <DemoFrame>{previewElement}</DemoFrame>
        </ActiveStyleProvider>

        <div
          className={cn(
            "relative flex flex-col gap-2.5 bg-card p-4 **:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted",
            layout === "horizontal" &&
              "-ml-4 min-w-48 rounded-tr-md border-y border-r pl-8",
            layout === "vertical" && "border-x border-b",
          )}
        >
          <Controls
            controls={controls}
            values={values}
            onChange={handleChange}
          />
        </div>
      </div>
      <ViewTransition default="code-fade">
        <CodeBlock
          className="rounded-t-none border-t-0"
          actions={
            <>
              <Button
                variant="quiet"
                size="sm"
                className="h-7 gap-1 pr-2 pl-1 text-xs"
                onPress={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUpIcon /> Collapse
                  </>
                ) : (
                  <>
                    <ChevronDownIcon /> Expand
                  </>
                )}
              </Button>
              <Tooltip>
                <Button
                  aria-label="Toggle orientation"
                  onPress={() =>
                    setLayout((prev) =>
                      prev === "horizontal" ? "vertical" : "horizontal",
                    )
                  }
                  variant="quiet"
                  size="sm"
                  className="size-7"
                >
                  {layout === "horizontal" ? <Columns2Icon /> : <Rows2Icon />}
                </Button>
                <TooltipContent hideArrow>Toggle layout</TooltipContent>
              </Tooltip>
            </>
          }
        >
          <Suspense fallback={fallback}>
            <DynamicPre code={displayedCode} lang="tsx" />
          </Suspense>
        </CodeBlock>
      </ViewTransition>
    </div>
  );
}

function getDefaultValue(control: Control): unknown {
  switch (control.type) {
    case "boolean":
      return control.defaultValue ?? false;
    case "string":
      return control.defaultValue ?? "";
    case "number":
      return control.defaultValue ?? 0;
    case "enum":
      return control.defaultValue ?? control.options[0];
    case "icon":
      return null;
    default:
      return undefined;
  }
}

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  // Handle null/undefined equivalence for icons
  if ((a === null || a === undefined) && (b === null || b === undefined))
    return true;
  return false;
}
