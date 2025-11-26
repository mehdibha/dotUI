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

export async function Reference({ name }: ReferenceProps) {
  const data = await loadApiReference(name);

  if (!data) {
    return (
      <div className="my-4 rounded-md border border-danger bg-danger/10 p-4 text-danger text-sm">
        API reference not found for "{name}"
      </div>
    );
  }

  // Transform props to PropData with pre-rendered descriptions
  const propsData: PropData[] = Object.entries(data.props).map(
    ([propName, prop]) => ({
      name: propName,
      type: prop.type,
      default: prop.default,
      description: renderDescription(prop.description),
      required: prop.default === undefined && !prop.type?.includes("undefined"),
    }),
  );

  return <PropsTable data={propsData} componentName={name} />;
}
