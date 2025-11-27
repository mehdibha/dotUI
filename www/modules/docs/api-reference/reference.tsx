import { highlight } from "fumadocs-core/highlight";
import Markdown from "markdown-to-jsx";

import { DEFAULT_EXPANDED, groupProps } from "./groups";
import {
  type GroupedPropsData,
  type PropData,
  PropsTable,
} from "./props-table";
import { type RenderPropData, RenderPropsTable } from "./render-props-table";
import type {
  ComponentApiReference,
  PropDefinition,
  RenderPropDefinition,
} from "./types";

export interface ReferenceProps {
  name: string;
  className?: string;
}

async function loadApiReference(
  name: string,
): Promise<ComponentApiReference | null> {
  try {
    const data = await import(`./generated/${name}.json`);
    return data.default as ComponentApiReference;
  } catch (error) {
    console.error(`Failed to load API reference for "${name}":`, error);
    return null;
  }
}

/**
 * Render markdown description to React nodes (server-side only)
 */
function renderDescription(description: string | undefined): React.ReactNode {
  if (!description) return undefined;

  return (
    <Markdown
      options={{
        forceInline: true,
        disableParsingRawHTML: true,
      }}
    >
      {description}
    </Markdown>
  );
}

/**
 * Highlight code using fumadocs shiki
 */
async function highlightCode(
  code: string,
  lang = "ts",
): Promise<React.ReactNode> {
  if (!code) return null;

  const highlighted = await highlight(code, {
    lang,
    components: {
      pre: ({ children, ...props }) => (
        <code
          {...props}
          className="**:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
        >
          {children}
        </code>
      ),
    },
  });

  return highlighted;
}

/**
 * Get a shortened version of the type for display in the collapsed row
 */
function getShortType(name: string, type: string | undefined): string {
  if (!type) {
    return "unknown";
  }

  // Event handlers show as "function"
  if (/^on[A-Z]/.test(name)) {
    return "function";
  }

  // className/style render props
  if (name === "className" && type.includes("=>")) {
    return "string | function";
  }
  if (name === "style" && type.includes("=>")) {
    return "CSSProperties | function";
  }

  // Simple types - return as-is (now without | undefined since it's stripped)
  if (type === "boolean" || type === "string" || type === "number") {
    return type;
  }

  // Short union types (less than 4 members and under 50 chars)
  if (!type.includes("|") || (type.split("|").length < 4 && type.length < 50)) {
    return type;
  }

  // Complex unions
  return "union";
}

/**
 * Transform a PropDefinition to PropData with highlighting
 */
async function transformProp(
  propName: string,
  prop: PropDefinition,
): Promise<PropData> {
  const shortType = getShortType(propName, prop.type);
  // Use detailedType for the full type display (includes | undefined), fallback to type
  const fullType = prop.detailedType ?? prop.type;

  return {
    name: propName,
    type: fullType,
    typeHighlighted: await highlightCode(fullType, "ts"),
    shortType,
    shortTypeHighlighted: await highlightCode(shortType, "ts"),
    default: prop.default,
    defaultHighlighted: prop.default
      ? await highlightCode(prop.default, "ts")
      : undefined,
    description: renderDescription(prop.description),
    // Use the required field from the generated JSON (set by TypeScript's SymbolFlags.Optional)
    required: prop.required,
  };
}

/**
 * Transform a record of props to an array of PropData
 */
async function transformProps(
  props: Record<string, PropDefinition>,
): Promise<PropData[]> {
  return Promise.all(
    Object.entries(props).map(([name, prop]) => transformProp(name, prop)),
  );
}

/**
 * Sort props: required first, then preserve original order
 * This mirrors React Aria's approach of showing required props at the top
 */
function sortPropsRequiredFirst(props: PropData[]): PropData[] {
  return [...props].sort((a, b) => {
    if (a.required && !b.required) return -1;
    if (!a.required && b.required) return 1;
    return 0;
  });
}

/**
 * Transform a RenderPropDefinition to RenderPropData with highlighting
 */
async function transformRenderProp(
  name: string,
  renderProp: RenderPropDefinition,
): Promise<RenderPropData> {
  return {
    name,
    selector: renderProp.selector,
    selectorHighlighted: await highlightCode(renderProp.selector, "css"),
    description: renderDescription(renderProp.description),
  };
}

/**
 * Transform a record of render props to an array of RenderPropData
 */
async function transformRenderProps(
  renderProps: Record<string, RenderPropDefinition>,
): Promise<RenderPropData[]> {
  return Promise.all(
    Object.entries(renderProps).map(([name, prop]) =>
      transformRenderProp(name, prop),
    ),
  );
}

export async function Reference({ name, className }: ReferenceProps) {
  const data = await loadApiReference(name);

  if (!data) {
    throw new Error(`API reference not found for "${name}"`);
  }

  // Group the props
  const { ungrouped, groups } = groupProps(data.props);

  // Transform all props with highlighting and sort required first
  const groupedData: GroupedPropsData = {
    ungrouped: sortPropsRequiredFirst(await transformProps(ungrouped)),
    groups: Object.fromEntries(
      await Promise.all(
        Object.entries(groups).map(async ([groupName, groupProps]) => [
          groupName,
          sortPropsRequiredFirst(await transformProps(groupProps)),
        ]),
      ),
    ),
  };

  // Transform render props if available
  const renderPropsData = data.renderProps
    ? await transformRenderProps(data.renderProps)
    : [];

  return (
    <div className={className}>
      {data.description && (
        <p className="mb-4 text-fg-muted">
          {renderDescription(data.description)}
        </p>
      )}
      <PropsTable
        data={groupedData}
        componentName={name}
        defaultExpandedGroups={DEFAULT_EXPANDED}
      />
      {renderPropsData.length > 0 && (
        <>
          <h4 className="mt-8 mb-2 font-semibold text-base">Render Props</h4>
          <p className="mb-4 text-fg-muted text-sm">
            State values available in render prop functions. Use the CSS
            selectors for styling with data attributes.
          </p>
          <RenderPropsTable data={renderPropsData} componentName={name} />
        </>
      )}
    </div>
  );
}
