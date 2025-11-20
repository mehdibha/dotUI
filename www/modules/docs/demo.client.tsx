"use client";

import React, { startTransition, ViewTransition } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

import { useMounted } from "@/hooks/use-mounted";
import {
  injectAttributesIntoSource,
  stripPropsTypeAnnotations,
} from "@/modules/docs/code-transform";
import {
  areControlValuesEqual,
  buildControlDefaults,
  type ControlValue,
  type DemoControl,
} from "@/modules/docs/component-controls";
import { usePreferences } from "@/modules/preferences/preferences-atom";
import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";
import { ActiveStyleSelector } from "@/modules/styles/active-style-selector";
import { useActiveStyle } from "@/modules/styles/use-active-style";
import { CodeBlock } from "./code-block";
import { DemoControls } from "./demo-controls";
import { DynamicCodeBlock } from "./dynamic-code-block";

interface DemoClientProps extends React.ComponentProps<"div"> {
  component: React.ReactNode;
  code?: React.ReactNode;
  codeSource?: string;
  preview?: React.ReactNode;
  previewSource?: string;
  controls?: DemoControl[];
}

export type { DemoControl };

export function DemoClient({
  component,
  className,
  code,
  codeSource,
  preview,
  previewSource,
  controls,
  ...props
}: DemoClientProps) {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: style } = useActiveStyle();
  const isMounted = useMounted();
  const [isExpanded, setExpanded] = React.useState(true);
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

  const actions = (
    <>
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
      <Menu>
        <Button variant="quiet" size="sm" className="size-7!">
          <ExternalLinkIcon />
        </Button>
        <Popover placement="bottom end">
          <MenuContent className="**:[svg]:size-4">
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 147 70"
              >
                <path d="M56 50.203V14h14v46.156C70 65.593 65.593 70 60.156 70c-2.596 0-5.158-1-7-2.843L0 14h19.797L56 50.203ZM147 56h-14V23.953L100.953 56H133v14H96.687C85.814 70 77 61.186 77 50.312V14h14v32.156L123.156 14H91V0h36.312C138.186 0 147 8.814 147 19.688V56Z" />
              </svg>
              Open in v0
            </MenuItem>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                role="img"
                aria-hidden
                focusable={false}
              >
                <path
                  fill="currentColor"
                  d="M15.75 18H4.25C3.01 18 2 16.99 2 15.75V4.25C2 3.01 3.01 2 4.25 2h11.5C16.99 2 18 3.01 18 4.25v11.5c0 1.24-1.01 2.25-2.25 2.25M4.25 3.5c-.414 0-.75.336-.75.75v11.5c0 .414.336.75.75.75h11.5c.414 0 .75-.336.75-.75V4.25c0-.414-.336-.75-.75-.75z"
                />
              </svg>
              Open in CodeSandbox
            </MenuItem>
            <MenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                role="img"
                focusable={false}
                aria-hidden
              >
                <path
                  d="M9.20215,18.76367c-.18262,0-.37012-.03711-.55078-.11621-.62598-.27051-.94238-.91992-.77051-1.5791l1.17383-4.50586-3.34863.06348c-.52441,0-1.00879-.28418-1.26465-.74121-.25684-.45801-.24512-1.01953.02832-1.4668L9.7002,1.88574c.35547-.58203,1.04297-.80664,1.67383-.53906.62988.26465.95312.91211.78613,1.57422l-1.20508,4.7959,3.33887-.06152c.52734,0,1.01465.28711,1.26953.74902s.23926,1.02637-.04199,1.47266l-5.19141,8.25098c-.25781.40918-.68066.63574-1.12793.63574ZM9.10254,11.12598c.45215,0,.87109.20508,1.14746.5625.27637.3584.37012.81445.25586,1.25195l-.92969,3.56836,4.62695-7.35352h-3.29688c-.4502,0-.86719-.20312-1.14355-.55859-.27637-.35449-.37207-.80859-.2627-1.24512l.96582-3.84473-4.7168,7.69434,3.35352-.0752Z"
                  fill="currentColor"
                  stroke-width="0"
                />
              </svg>
              Open in StackBlitz
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    </>
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
          <DemoControls
            controls={controls}
            values={controlValues}
            onValueChange={handleControlChange}
          />
        )}
      </ActiveStyleProvider>
      <CodeBlock
        className="rounded-t-none border-t-0"
        // title="Code"
        actions={actions}
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
  controls: DemoControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  const updated = injectAttributesIntoSource(previewSource, attributes);
  return stripPropsTypeAnnotations(updated);
};

const applyControlsToCodeSource = (
  codeSource: string,
  controls: DemoControl[],
  values: Record<string, ControlValue>,
  defaults: Record<string, ControlValue>,
) => {
  const attributes = buildControlAttributes(controls, values, defaults);
  let updated = injectAttributesIntoSource(codeSource, attributes);
  updated = stripPropsTypeAnnotations(updated);
  return updated;
};

const buildControlAttributes = (
  controls: DemoControl[],
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
  control: DemoControl,
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

const formatAttribute = (control: DemoControl, value: ControlValue) => {
  if (control.type === "boolean") {
    return value ? control.name : `${control.name}={false}`;
  }

  if (typeof value === "number") {
    return `${control.name}={${value}}`;
  }

  return `${control.name}="${value}"`;
};
