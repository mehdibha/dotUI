import type {
  GroupedProps,
  PropDisplayDoc,
  PropDoc,
  PropGroups,
} from "./types";

/**
 * Groups an array of props according to the provided group definitions.
 * Props that don't match any group end up in `ungrouped`.
 */
export function groupPropDocs(
  props: PropDisplayDoc[],
  definitions: PropGroups,
): GroupedProps {
  const grouped: Record<string, PropDisplayDoc[]> = {};
  const ungrouped: PropDisplayDoc[] = [];

  for (const prop of props) {
    const groupName = findGroupForProp(prop, definitions);
    if (groupName) {
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(prop);
    } else {
      ungrouped.push(prop);
    }
  }

  return { ungrouped, groups: grouped };
}

/**
 * Finds the group name for a given prop based on string or regex matchers.
 * Returns undefined if no group matches.
 */
export function findGroupForProp(
  prop: PropDoc,
  definitions: PropGroups,
): string | undefined {
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
