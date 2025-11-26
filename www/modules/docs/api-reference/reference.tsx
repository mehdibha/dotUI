import { highlight } from "fumadocs-core/highlight";
import Markdown from "markdown-to-jsx";

import { type PropData, PropsTable } from "./props-table";
import type { ComponentApiReference } from "./types";

interface ReferenceProps {
  /** The name of the component (maps to generated/{name}.json) */
  name: string;
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

  // Simple types - return as-is
  if (
    type === "boolean" ||
    type === "string" ||
    type === "number" ||
    type === "boolean | undefined" ||
    type === "string | undefined" ||
    type === "number | undefined"
  ) {
    return type;
  }

  // Short union types
  if (!type.includes("|") || (type.split("|").length < 4 && type.length < 50)) {
    return type;
  }

  // Complex unions
  return "union";
}

export async function Reference({ name }: ReferenceProps) {
  const data = await loadApiReference(name);

  if (!data) {
    return (
      <div className="my-4 rounded-md border border-danger bg-danger/10 p-4 text-danger text-sm">
        API reference not found for "{name}"
      </div>
    );
  }

  // Transform props to PropData with pre-rendered descriptions and highlighted code
  const propsData: PropData[] = await Promise.all(
    Object.entries(data.props).map(async ([propName, prop]) => {
      const shortType = getShortType(propName, prop.type);

      return {
        name: propName,
        type: prop.type,
        typeHighlighted: await highlightCode(prop.type, "ts"),
        shortType,
        shortTypeHighlighted: await highlightCode(shortType, "ts"),
        default: prop.default,
        defaultHighlighted: prop.default
          ? await highlightCode(prop.default, "ts")
          : undefined,
        description: renderDescription(prop.description),
        required:
          prop.default === undefined && !prop.type?.includes("undefined"),
      };
    }),
  );

  return <PropsTable data={propsData} componentName={name} />;
}
