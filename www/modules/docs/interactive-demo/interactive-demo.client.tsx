"use client";

import type * as React from "react";
import { Suspense, useMemo, useState } from "react";

import { Index } from "@dotui/registry/ui/demos";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";
import { Text } from "@dotui/registry/ui/text";

import { CodeBlock } from "@/modules/docs/code-block";
import { DynamicCodeBlock } from "@/modules/docs/code-block/dynamic-code-block";
import { DemoFrame } from "@/modules/docs/demo/demo-frame";
import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";

import type {
  InteractiveDemoControl,
  InteractiveDemoSharedConfig,
} from "./types";

interface InteractiveDemoClientProps extends InteractiveDemoSharedConfig {
  name: string;
  componentName: string;
  importPath: string;
}

export function InteractiveDemoClient({
  name,
  controls = [],
  initialProps,
  componentName,
  importPath,
  description,
}: InteractiveDemoClientProps) {
  const demoEntry = Index[name];
  const Component = demoEntry?.component;

  if (!Component) {
    return (
      <div className="mt-6 rounded-md border border-border-danger bg-danger-muted/30 p-4 text-sm text-fg-danger">
        Interactive demo "{name}" failed to load.
      </div>
    );
  }
  const [demoProps, setDemoProps] = useState<Record<string, unknown>>(() => {
    const controlDefaults: Record<string, unknown> = {};
    for (const control of controls) {
      if ("defaultValue" in control && control.defaultValue !== undefined) {
        controlDefaults[control.prop] = control.defaultValue;
      }
    }
    return { ...controlDefaults, ...(initialProps ?? {}) };
  });

  const handlePropChange = (prop: string, value: unknown) => {
    setDemoProps((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const codeSample = useMemo(
    () => generateCodeSnippet(componentName, importPath, demoProps),
    [componentName, importPath, demoProps],
  );

  return (
    <div className="not-first:mt-6 space-y-6">
      <ActiveStyleProvider
        unstyled
        className="flex min-h-56 items-stretch rounded-lg border bg-bg"
        skeletonClassName="border rounded-lg"
      >
        <DemoFrame>
          <Suspense
            fallback={
              <div className="flex min-h-24 items-center justify-center text-fg-muted text-sm">
                Loading component…
              </div>
            }
          >
            <Component {...demoProps} />
          </Suspense>
        </DemoFrame>
      </ActiveStyleProvider>

      {controls.length > 0 ? (
        <section className="rounded-lg border bg-card/60 p-4">
          {description ? (
            <Text className="mb-4 text-sm text-fg-muted">{description}</Text>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {controls.map((control) => (
              <ControlCard
                key={control.prop}
                control={control}
                value={demoProps[control.prop]}
                onChange={handlePropChange}
              />
            ))}
          </div>
        </section>
      ) : null}

      <CodeBlock title="Example code">
        <DynamicCodeBlock code={codeSample} lang="tsx" />
      </CodeBlock>
    </div>
  );
}

interface ControlCardProps {
  control: InteractiveDemoControl;
  value: unknown;
  onChange: (prop: string, value: unknown) => void;
}

function ControlCard({ control, value, onChange }: ControlCardProps) {
  switch (control.control) {
    case "boolean":
      return (
        <div className="rounded-lg border bg-bg p-3">
          <Switch
            isSelected={Boolean(value)}
            onChange={(selected) => onChange(control.prop, selected)}
            aria-label={control.label ?? control.prop}
          >
            <SwitchIndicator />
            <Label>{control.label ?? formatPropLabel(control.prop)}</Label>
          </Switch>
          {control.description ? (
            <Text className="mt-2 text-xs text-fg-muted">
              {control.description}
            </Text>
          ) : null}
        </div>
      );
    case "select":
      return (
        <div className="space-y-2 rounded-lg border bg-bg p-3">
          <Label className="text-sm font-medium">
            {control.label ?? formatPropLabel(control.prop)}
          </Label>
          <Select
            aria-label={control.label ?? control.prop}
            selectedKey={
              typeof value === "string" || typeof value === "number"
                ? (value as React.Key)
                : null
            }
            onSelectionChange={(key) =>
              onChange(control.prop, key != null ? key.toString() : undefined)
            }
          >
            <SelectTrigger />
            <SelectContent>
              {control.options.map((option) => (
                <SelectItem key={option.value} id={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {control.description ? (
            <Text className="text-xs text-fg-muted">{control.description}</Text>
          ) : null}
        </div>
      );
    case "text":
      return (
        <div className="space-y-2 rounded-lg border bg-bg p-3">
          <Label className="text-sm font-medium">
            {control.label ?? formatPropLabel(control.prop)}
          </Label>
          <Input
            value={typeof value === "string" ? value : ""}
            placeholder={control.placeholder}
            onChange={(nextValue) => onChange(control.prop, nextValue)}
          />
          {control.description ? (
            <Text className="text-xs text-fg-muted">{control.description}</Text>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

function generateCodeSnippet(
  componentName: string,
  importPath: string,
  props: Record<string, unknown>,
) {
  const sanitizedProps = Object.entries(props).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (value === undefined) return acc;
      acc[key] = value;
      return acc;
    },
    {},
  );

  const { children, ...rest } = sanitizedProps;
  const propEntries = Object.entries(rest)
    .map(([key, value]) => formatProp(key, value))
    .filter(Boolean) as string[];

  const propsBlock = propEntries.length
    ? `\n${propEntries.map((line) => `  ${line}`).join("\n")}\n`
    : "";

  const childrenContent = formatChildren(children);
  let jsx: string;

  if (childrenContent) {
    const childLines = indentMultiline(childrenContent, "  ");
    jsx = propsBlock
      ? `<${componentName}${propsBlock}>\n${childLines}\n</${componentName}>`
      : `<${componentName}>\n${childLines}\n</${componentName}>`;
  } else if (propsBlock) {
    jsx = `<${componentName}${propsBlock}/>`;
  } else {
    jsx = `<${componentName} />`;
  }

  const returnBlock =
    jsx.includes("\n") || jsx.length > 60
      ? `(\n${indentMultiline(jsx, "    ")}\n  )`
      : jsx;

  return `import { ${componentName} } from "${importPath}";

function Demo() {
  return ${returnBlock};
}
`;
}

function formatProp(prop: string, value: unknown) {
  if (value === undefined) return null;
  if (typeof value === "string") {
    return `${prop}="${escapeDoubleQuotes(value)}"`;
  }
  if (typeof value === "number") {
    return `${prop}={${value}}`;
  }
  if (typeof value === "boolean") {
    return value ? prop : `${prop}={false}`;
  }
  if (value === null) {
    return `${prop}={null}`;
  }
  if (typeof value === "object") {
    return `${prop}={${JSON.stringify(value, null, 2)}}`;
  }
  return null;
}

function formatChildren(value: unknown) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `{${value}}`;
  }
  if (typeof value === "object") {
    return `{${JSON.stringify(value, null, 2)}}`;
  }
  return "";
}

function indentMultiline(value: string, indent: string) {
  return value
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
}

function escapeDoubleQuotes(value: string) {
  return value.replace(/"/g, '\\"');
}

function formatPropLabel(prop: string) {
  return prop
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

