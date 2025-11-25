"use client";

import React, {
  type ComponentType,
  createElement,
  useCallback,
  useMemo,
  useState,
  ViewTransition,
} from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import type { Control, ControlValues } from "@dotui/registry/playground";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { CodeBlock, DynamicPre } from "../code-block";
import { DemoFrame } from "../demo/demo-frame";
import { availableIcons, ControlsPanel } from "./controls";
import { elementToCode, elementToPreviewCode } from "./element-to-code";

/**
 * Interactive demo client component.
 * Renders the playground, controls, and live code output.
 */

interface InteractiveDemoClientProps {
  component: ComponentType<Record<string, unknown>>;
  controls: Control[];
  className?: string;
}

export function InteractiveDemoClient({
  component: Playground,
  controls,
  className,
}: InteractiveDemoClientProps) {
  // State for code expansion
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Render the playground element for preview
  const previewElement = useMemo(
    () => createElement(Playground, propsWithIcons),
    [Playground, propsWithIcons],
  );

  // Call the playground function to get what it actually renders (for code serialization)
  // This gives us <TextField>...</TextField> instead of <Playground ...>
  const renderedElement = useMemo(() => {
    // All playground components are function components, so we can call them directly
    const PlaygroundFn = Playground as (
      props: Record<string, unknown>,
    ) => React.ReactElement;
    return PlaygroundFn(propsWithIcons);
  }, [Playground, propsWithIcons]);

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
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-lg border bg-card",
        className,
      )}
    >
      {/* Layout grid: preview on left, controls on right, code at bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
        {/* Preview area */}
        <ActiveStyleProvider
          unstyled
          className="flex min-h-56 items-stretch border-b lg:border-r lg:border-b-0"
          skeletonClassName="rounded-none"
        >
          <DemoFrame>
            <div
              role="group"
              aria-label="Rendered component"
              className="flex min-h-48 w-full items-center justify-center overflow-auto p-6"
            >
              {previewElement}
            </div>
          </DemoFrame>
        </ActiveStyleProvider>

        {/* Controls panel */}
        <div className="border-b p-4 lg:border-b-0">
          <h3 className="mb-4 font-medium text-fg-muted text-sm uppercase tracking-wide">
            Controls
          </h3>
          <ControlsPanel
            controls={controls}
            values={values}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Code block at bottom */}
      <div className="border-t">
        <CodeBlock
          title="Code"
          className={cn("rounded-none rounded-b-lg border-0")}
          actions={
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
          }
        >
          <ViewTransition default="code-fade">
            <DynamicPre code={displayedCode} lang="tsx" />
          </ViewTransition>
        </CodeBlock>
      </div>
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
