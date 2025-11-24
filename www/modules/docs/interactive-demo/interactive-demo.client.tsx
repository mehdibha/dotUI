"use client";

import { Suspense, useMemo, useState } from "react";

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
  jsxTemplate,
}: InteractiveDemoClientProps) {
  const demoEntry = Index[name];
  const Component = demoEntry?.component;
  const [showFullCode, setShowFullCode] = useState(false);
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

  const codeSamples = useMemo(
    () => getCodeSamples(jsxTemplate, componentName, importPath, demoProps),
    [jsxTemplate, componentName, importPath, demoProps],
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
                  : (nextValue as { target?: { value?: string } })?.target
                      ?.value ?? "";
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

function getCodeSamples(
  template: JSXTemplate | undefined,
  componentName: string,
  importPath: string,
  props: Record<string, unknown>,
) {
  if (template) {
    return generateTemplateCodeSamples(template, props);
  }

  return generateDefaultCodeSamples(componentName, importPath, props);
}

function generateDefaultCodeSamples(
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
  const inlineProps = propEntries.length ? ` ${propEntries.join(" ")}` : "";

  const childrenContent = formatChildren(children);
  let jsx: string;

  const isSimpleTextChild =
    typeof children === "string" && !children.includes("\n");
  const inlineLength =
    componentName.length +
    inlineProps.length +
    (isSimpleTextChild ? children.length : 0);
  const canInlineChildren = isSimpleTextChild && inlineLength <= 60;

  if (canInlineChildren) {
    jsx = `<${componentName}${inlineProps}>${children}</${componentName}>`;
  } else if (childrenContent) {
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

  const full = [
    `import { ${componentName} } from "${importPath}";`,
    "",
    "function Demo() {",
    `  return ${returnBlock};`,
    "}",
  ].join("\n");

  return {
    full,
    jsx,
  };
}

function generateTemplateCodeSamples(
  template: JSXTemplate,
  props: Record<string, unknown>,
) {
  const tree = renderTemplateNode(template.tree, props);
  const jsx = tree ? renderTree(tree) : "";
  const returnBlock =
    jsx.includes("\n") || jsx.length > 60
      ? `(\n${indentMultiline(jsx, "    ")}\n  )`
      : jsx;

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
      return formatProp(prop.name, prop.value);
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
