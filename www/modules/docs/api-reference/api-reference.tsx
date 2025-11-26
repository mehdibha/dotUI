import { codeToHtml } from "shiki";

import { DEFAULT_EXPANDED_GROUPS, DEFAULT_PROP_GROUPS } from "./groups";
import { parseComponentProps } from "./parser";
import { PropTable } from "./prop-table.client";
import type {
  ApiReferenceProps,
  GroupedProps,
  PropDisplayDoc,
  PropDoc,
  PropGroups,
} from "./types";

export async function ApiReference({
  source,
  types,
  groups = DEFAULT_PROP_GROUPS,
  defaultExpanded,
}: ApiReferenceProps) {
  const expandedSet = new Set(
    defaultExpanded ?? Array.from(DEFAULT_EXPANDED_GROUPS),
  );

  if (!types?.length) {
    return null;
  }

  const sections = await Promise.all(
    types.map(async ({ name, label }) => {
      const parsedProps = parseComponentProps(source, name);
      if (!parsedProps.length) {
        return null;
      }

      const decorated = await decorateProps(parsedProps);
      const grouped = groupPropDocs(decorated, groups);

      return {
        name,
        label,
        count: decorated.length,
        grouped,
      };
    }),
  );

  return (
    <div className="not-first:mt-8 space-y-10">
      {sections.map((section) => {
        if (!section) return null;
        return (
          <section key={section.name} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-lg tracking-tight">
                {section.label ?? section.name}
              </h3>
              <span className="text-fg-muted text-sm">
                {section.count} prop{section.count === 1 ? "" : "s"}
              </span>
            </div>

            <PropGroupTables
              grouped={section.grouped}
              groupDefinitions={groups}
              expandedSet={expandedSet}
            />
          </section>
        );
      })}
    </div>
  );
}

function PropGroupTables({
  grouped,
  groupDefinitions,
  expandedSet,
}: {
  grouped: GroupedProps;
  groupDefinitions: PropGroups;
  expandedSet: Set<string>;
}) {
  const orderedGroupNames = Object.keys(groupDefinitions).filter(
    (group) => grouped.groups[group]?.length,
  );

  return (
    <div className="space-y-4">
      {grouped.ungrouped.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-fg-muted text-xs uppercase tracking-wide">
            General
          </p>
          <PropTable props={grouped.ungrouped} />
        </div>
      )}

      {orderedGroupNames.map((group) => (
        <details
          key={group}
          className="overflow-hidden rounded-lg border border-border"
          open={expandedSet.has(group)}
        >
          <summary className="cursor-default bg-card px-4 py-2 font-medium text-sm tracking-tight">
            {group}
          </summary>
          <div className="border-border border-t">
            <PropTable props={grouped.groups[group]!} variant="plain" />
          </div>
        </details>
      ))}
    </div>
  );
}

function groupPropDocs(
  props: PropDisplayDoc[],
  definitions: PropGroups,
): GroupedProps {
  const grouped: Record<string, PropDisplayDoc[]> = {};
  const ungrouped: PropDisplayDoc[] = [];

  props.forEach((prop) => {
    const groupName = findGroupForProp(prop, definitions);
    if (groupName) {
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName]!.push(prop);
    } else {
      ungrouped.push(prop);
    }
  });

  return {
    ungrouped,
    groups: grouped,
  };
}

function findGroupForProp(prop: PropDoc, definitions: PropGroups) {
  for (const [groupName, matchers] of Object.entries(definitions)) {
    for (const matcher of matchers) {
      if (typeof matcher === "string") {
        if (matcher === prop.name) {
          return groupName;
        }
      } else if (matcher.test(prop.name)) {
        return groupName;
      }
    }
  }

  return undefined;
}

async function decorateProps(props: PropDoc[]) {
  return Promise.all(
    props.map(async (prop) => {
      const typeSummary = formatTypeSummary(prop.type);
      const [
        highlightedName,
        highlightedType,
        highlightedTypeSummary,
        highlightedDefault,
      ] = await Promise.all([
        highlightInline(prop.name),
        highlightInline(prop.type),
        highlightInline(typeSummary),
        prop.defaultValue
          ? highlightInline(prop.defaultValue)
          : Promise.resolve(undefined),
      ]);

      return {
        ...prop,
        typeSummary,
        highlightedName,
        highlightedType,
        highlightedTypeSummary,
        highlightedDefault,
      };
    }),
  );
}

function formatTypeSummary(type: string) {
  if (!type) {
    return "-";
  }

  if (type.includes("=>")) {
    return "function";
  }

  const parts = type
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const filtered = parts.filter(
    (part) =>
      part !== "undefined" &&
      part !== "null" &&
      part !== "void" &&
      part !== "never",
  );

  const summary = filtered.join(" | ") || "-";

  if (summary.length > 48) {
    return `${summary.slice(0, 45)}…`;
  }

  return summary;
}

async function highlightInline(code: string | undefined, lang = "tsx") {
  if (!code?.trim()) {
    return undefined;
  }

  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
  return match ? match[1] : undefined;
}
