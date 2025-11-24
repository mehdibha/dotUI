"use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
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
import { renderTree } from "./formatter/render";
import type { RenderNode, RenderText } from "./formatter/types";
import type {
  InteractiveDemoControl,
  InteractiveDemoSharedConfig,
  JSXTemplate,
  JSXTemplateChild,
  JSXTemplateCondition,
  JSXTemplateElement,
  JSXTemplateProp,
  JSXTemplateText,
} from "./types";

interface InteractiveDemoClientProps extends InteractiveDemoSharedConfig {
  name: string;
}

export function InteractiveDemoClient({
  name,
  controls = [],
  initialProps,
  description,
  jsxTemplate,
}: InteractiveDemoClientProps) {
  if (!jsxTemplate) {
    throw new Error(
      `InteractiveDemo "${name}" requires a jsxTemplate prop to render.`,
    );
  }

  const demoEntry = Index[name];
  const Component = demoEntry?.component;
  const controlsMap = useMemo(() => normalizeControls(controls), [controls]);
  const [showFullCode, setShowFullCode] = useState(false);
  const [demoProps, setDemoProps] = useState<Record<string, unknown>>(() => {
    const controlDefaults: Record<string, unknown> = {};
    Object.values(controlsMap).forEach((control) => {
      if ("defaultValue" in control && control.defaultValue !== undefined) {
        controlDefaults[control.prop] = control.defaultValue;
      }
    });
    return { ...controlDefaults, ...(initialProps ?? {}) };
  });

  useEffect(() => {
    setDemoProps((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.values(controlsMap).forEach((control) => {
        if (
          control &&
          "defaultValue" in control &&
          control.defaultValue !== undefined &&
          next[control.prop] === undefined
        ) {
          next[control.prop] = control.defaultValue;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [controlsMap]);

  const handlePropChange = (prop: string, value: unknown) => {
    setDemoProps((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const codeSamples = useMemo(
    () => generateTemplateCodeSamples(jsxTemplate, demoProps),
    [jsxTemplate, demoProps],
  );

  if (!Component) {
    return (
      <div
        className={cn(
          "mt-6",
          "rounded-md",
          "border",
          "border-border-danger",
          "bg-danger-muted/30",
          "p-4",
          "text-sm",
          "text-fg-danger",
        )}
      >
        Interactive demo "{name}" failed to load.
      </div>
    );
  }

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
            <Text className="mb-4 text-fg-muted text-sm">{description}</Text>
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

      <CodeBlock
        title="Example code"
        actions={
          <Button
            variant="quiet"
            size="sm"
            className={cn("h-7", "gap-1", "pr-2", "pl-1", "text-xs")}
            onPress={() => setShowFullCode((prev) => !prev)}
          >
            {showFullCode ? "Hide imports" : "Show imports"}
          </Button>
        }
      >
        <DynamicCodeBlock
          code={showFullCode ? codeSamples.full : codeSamples.jsx}
          lang="tsx"
        />
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
        <div className={cn("bg-bg", "border", "p-3", "rounded-lg")}>
          <Switch
            isSelected={Boolean(value)}
            onChange={(selected) => onChange(control.prop, selected)}
            aria-label={control.label ?? control.prop}
          >
            <SwitchIndicator />
            <Label>{control.label ?? formatPropLabel(control.prop)}</Label>
          </Switch>
          {control.description ? (
            <Text className="mt-2 text-fg-muted text-sm">
              {control.description}
            </Text>
          ) : null}
        </div>
      );
    case "select":
      return (
        <div
          className={cn("bg-bg", "border", "p-3", "rounded-lg", "space-y-2")}
        >
          <Label className="font-medium text-sm">
            {control.label ?? formatPropLabel(control.prop)}
          </Label>
          <Select
            aria-label={control.label ?? control.prop}
            selectedKey={
              typeof value === "string" || typeof value === "number"
                ? String(value)
                : undefined
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
            <Text className="text-fg-muted text-sm">{control.description}</Text>
          ) : null}
        </div>
      );
    case "text":
      return (
        <div
          className={cn("bg-bg", "border", "p-3", "rounded-lg", "space-y-2")}
        >
          <Label className="font-medium text-sm">
            {control.label ?? formatPropLabel(control.prop)}
          </Label>
          <Input
            value={typeof value === "string" ? value : ""}
            placeholder={control.placeholder}
            onChange={(nextValue) => {
              const resolvedValue =
                typeof nextValue === "string"
                  ? nextValue
                  : ((nextValue as { target?: { value?: string } })?.target
                      ?.value ?? "");
              onChange(control.prop, resolvedValue);
            }}
          />
          {control.description ? (
            <Text className="text-fg-muted text-sm">{control.description}</Text>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

function generateTemplateCodeSamples(
  template: JSXTemplate,
  props: Record<string, unknown>,
) {
  const tree = renderTemplateNode(template.tree, props);
  const jsx = tree ? renderTree(tree) : "";
  const returnBlock = formatReturnBlock(jsx);

  const importLines = template.imports.map(
    (entry) => `import { ${entry.members.join(", ")} } from "${entry.module}";`,
  );

  const parts = [...importLines];
  if (importLines.length) {
    parts.push("");
  }
  parts.push("function Demo() {");
  parts.push(`  return ${returnBlock};`);
  parts.push("}");
  const full = parts.join("\n");

  return {
    full,
    jsx,
  };
}

function formatReturnBlock(jsx: string) {
  if (!jsx) return "";
  if (jsx.includes("\n") || jsx.length > 60) {
    return `(\n${indentMultiline(jsx, "    ")}\n  )`;
  }
  return jsx;
}

function renderTemplateNode(
  node: JSXTemplateElement,
  props: Record<string, unknown>,
): RenderNode | null {
  if (node.condition && !evaluateTemplateCondition(node.condition, props)) {
    return null;
  }

  const propStrings =
    node.props
      ?.map((prop) => renderTemplateProp(prop, props))
      .filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0,
      ) ?? [];

  const children =
    node.children
      ?.map((child) => renderTemplateChild(child, props))
      .filter((child): child is RenderNode | RenderText => Boolean(child)) ??
    [];

  return {
    name: node.name,
    props: propStrings,
    children,
  };
}

function renderTemplateChild(
  child: JSXTemplateChild,
  props: Record<string, unknown>,
): RenderNode | RenderText | null {
  if (child.type === "text") {
    return renderTemplateText(child, props);
  }
  return renderTemplateNode(child, props);
}

function renderTemplateText(
  node: JSXTemplateText,
  props: Record<string, unknown>,
): RenderText | null {
  const raw = node.value ?? (node.prop ? props[node.prop] : undefined);
  if (raw == null) {
    return null;
  }
  let value = typeof raw === "string" ? raw : String(raw);
  if (node.trim) {
    value = value.trim();
  }
  if (!value) {
    return null;
  }
  return {
    type: "text",
    value: escapeDoubleQuotes(value),
  };
}

function renderTemplateProp(
  prop: JSXTemplateProp,
  props: Record<string, unknown>,
): string | null {
  switch (prop.kind) {
    case "literal":
      return formatTemplateProp(prop.name, prop.value);
    case "string": {
      const rawValue = props[prop.prop];
      if (rawValue == null) {
        return null;
      }
      let value = typeof rawValue === "string" ? rawValue : String(rawValue);
      if (prop.trim) {
        value = value.trim();
      }
      if (prop.omitIfEmpty && value.length === 0) {
        return null;
      }
      return `${prop.name}="${escapeDoubleQuotes(value)}"`;
    }
    case "boolean": {
      const value = Boolean(props[prop.prop]);
      if (prop.omitIfFalse && !value) {
        return null;
      }
      return value ? prop.name : `${prop.name}={false}`;
    }
    case "enum": {
      const rawValue = props[prop.prop];
      const mapped = prop.values[String(rawValue ?? "")];
      if (!mapped) {
        return null;
      }
      if (prop.omitIfValue && mapped === prop.omitIfValue) {
        return null;
      }
      return `${prop.name}="${mapped}"`;
    }
    default:
      return null;
  }
}

function evaluateTemplateCondition(
  condition: JSXTemplateCondition,
  props: Record<string, unknown>,
): boolean {
  switch (condition.kind) {
    case "propTruthy": {
      let value = props[condition.prop];
      if (typeof value === "string" && condition.trim) {
        value = value.trim();
      }
      return Boolean(value);
    }
    case "propEquals":
      return props[condition.prop] === condition.value;
    case "propNotEmpty": {
      let value = props[condition.prop];
      if (typeof value === "string" && condition.trim) {
        value = value.trim();
      }
      if (typeof value === "string") {
        return value.length > 0;
      }
      return Boolean(value);
    }
    default:
      return false;
  }
}

function formatTemplateProp(prop: string, value: unknown) {
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

function normalizeControls(controls: InteractiveDemoControl[]) {
  return controls.reduce<Record<string, InteractiveDemoControl>>(
    (acc, control) => {
      acc[control.prop] = control;
      return acc;
    },
    {},
  );
}
