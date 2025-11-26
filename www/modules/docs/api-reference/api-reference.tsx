import { groupPropDocs } from "./grouping";
import { DEFAULT_EXPANDED_GROUPS, DEFAULT_PROP_GROUPS } from "./groups";
import { decorateProps } from "./highlight";
import { parseComponentProps } from "./parser";
import { PropTable } from "./prop-table";
import type { ApiReferenceProps, GroupedProps, PropGroups } from "./types";

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

      return { name, label, grouped };
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
