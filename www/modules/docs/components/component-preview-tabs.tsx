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
import {
  injectAttributesIntoSource,
  stripPropsTypeAnnotations,
} from "@/modules/docs/lib/code-transform";
import {
  areControlValuesEqual,
  buildControlDefaults,
  type ComponentPreviewControl,
  type ControlValue,
} from "@/modules/docs/lib/component-controls";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";
import { CodeBlock } from "./code-block";
import { ComponentPreviewControls } from "./component-preview-controls";
import { DynamicCodeBlock } from "./dynamic-code-block";

interface ComponentPreviewTabsProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  code?: React.ReactNode;
  codeSource?: string;
  preview?: React.ReactNode;
  previewSource?: string;
  controls?: ComponentPreviewControl[];
}

export type { ComponentPreviewControl };

export function ComponentPreviewTabs({
  component,
  className,
  code,
  codeSource,
  preview,
  previewSource,
  controls,
  ...props
}: ComponentPreviewTabsProps) {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: style } = useActiveStyle();
  const isMounted = useMounted();
  const [isExpanded, setExpanded] = React.useState(false);
  const hasControls = Boolean(controls?.length);

  const controlDefaults = React.useMemo(
    () => buildControlDefaults(controls),
    [controls],
  );

  const [controlValues, setControlValues] =
    React.useState<Record<string, ControlValue>>(controlDefaults);

  React.useEffect(() => {
    setControlValues((previous) =>
      areControlValuesEqual(previous, controlDefaults)
        ? previous
        : controlDefaults,
    );
  }, [controlDefaults]);

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

  const previewWithControls = React.useMemo(() => {
    if (!hasControls || !previewSource || !controls?.length) {
      return undefined;
    }

    return applyControlsToPreviewSource(
      previewSource,
      controls,
      controlValues,
      controlDefaults,
    );
  }, [controlDefaults, controlValues, controls, hasControls, previewSource]);

  const codeWithControls = React.useMemo(() => {
    if (!hasControls || !codeSource || !controls?.length) {
      return undefined;
    }

    return applyControlsToCodeSource(
      codeSource,
      controls,
      controlValues,
      controlDefaults,
    );
  }, [codeSource, controlDefaults, controlValues, controls, hasControls]);

  const previewContent =
    hasControls && previewSource ? (
      <DynamicCodeBlock
        code={(previewWithControls ?? previewSource).trim()}
        lang="tsx"
        fallback={preview}
      />
    ) : (
      preview
    );

  const codeContent =
    hasControls && codeSource ? (
      <DynamicCodeBlock
        code={(codeWithControls ?? codeSource).trim()}
        lang="tsx"
        fallback={code}
      />
    ) : (
      code
    );

  return (
    <div className={cn("", className)} {...props}>
      <ActiveStyleProvider
        unstyled
        className="flex min-h-56 items-stretch"
        skeletonClassName="border rounded-t-md"
      >
        <div className="relative z-1 flex flex-1 items-center justify-center rounded-t-lg border bg-bg pt-24 pb-20">
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
          {isExpanded ? codeContent : previewContent}
        </ViewTransition>
      </CodeBlock>
    </div>
  );
}

const applyControlsToPreviewSource = (
  previewSource: string,
  controls: ComponentPreviewControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  const updated = injectAttributesIntoSource(previewSource, attributes);
  return stripPropsTypeAnnotations(updated);
};

const applyControlsToCodeSource = (
  codeSource: string,
  controls: ComponentPreviewControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  let updated = injectAttributesIntoSource(codeSource, attributes);
  updated = stripPropsTypeAnnotations(updated);
  return updated;
};

const buildControlAttributes = (
  controls: ComponentPreviewControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes: string[] = [];

  controls.forEach((control) => {
    const value = values[control.name];
    const defaultValue = defaults[control.name];

    if (!shouldRenderAttribute(control, value, defaultValue)) {
      return;
    }

    attributes.push(formatAttribute(control, value));
  });

  return attributes;
};

const shouldRenderAttribute = (
  control: ComponentPreviewControl,
  value: ControlValue,
  defaultValue: ControlValue,
) => {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  if (value === defaultValue) {
    return false;
  }

  if (control.type === "boolean") {
    return true;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return true;
};

const formatAttribute = (
  control: ComponentPreviewControl,
  value: ControlValue,
) => {
  if (control.type === "boolean") {
    return value ? control.name : `${control.name}={false}`;
  }

  if (typeof value === "number") {
    return `${control.name}={${value}}`;
  }

  return `${control.name}="${value}"`;
};
