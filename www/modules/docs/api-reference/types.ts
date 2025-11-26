export interface PropDoc {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  defaultValue?: string;
  deprecated?: string;
}

export interface PropDisplayDoc extends PropDoc {
  typeSummary: string;
  highlightedName?: string;
  highlightedType?: string;
  highlightedTypeSummary?: string;
  highlightedDefault?: string;
}

export interface ApiReferenceTypeConfig {
  /**
   * The exported interface or type alias name to document.
   */
  name: string;
  /**
   * Optional label rendered above the table. Falls back to `name`.
   */
  label?: string;
}

export interface ApiReferenceProps {
  /**
   * Source file that exports the types, relative to the repository root.
   */
  source: string;
  /**
   * Which exports should be documented.
   */
  types: ApiReferenceTypeConfig[];
  /**
   * Custom grouping definition. Defaults to the S2-inspired groups.
   */
  groups?: PropGroups;
  /**
   * Groups expanded on initial render.
   */
  defaultExpanded?: string[];
}

export type PropGroups = Record<string, (string | RegExp)[]>;

export interface GroupedProps {
  ungrouped: PropDisplayDoc[];
  groups: Record<string, PropDisplayDoc[]>;
}
