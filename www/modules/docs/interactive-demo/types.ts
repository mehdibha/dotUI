import type { ReactNode } from "react";

export type InteractiveDemoControl =
  | InteractiveDemoBooleanControl
  | InteractiveDemoSelectControl
  | InteractiveDemoTextControl;

export interface InteractiveDemoDependency {
  kind: "import";
  module: string;
  /**
   * Named exports that should be imported when the dependency is active.
   */
  members?: string[];
  /**
   * Optional default import identifier.
   */
  defaultImport?: string;
  /**
   * Optional condition describing when the dependency should be included.
   * If omitted, the dependency is included whenever the associated prop is truthy.
   */
  when?: InteractiveDemoDependencyCondition;
}

export type InteractiveDemoDependencyCondition =
  | { type: "truthy"; selector?: string }
  | { type: "equals"; value: unknown; selector?: string }
  | { type: "in"; values: unknown[]; selector?: string };

export type InteractiveDemoSlotConfig = Record<string, boolean>;

interface InteractiveDemoBaseControl {
  /** Name of the prop to update on the component. */
  prop: string;
  /** Optional UI label, falls back to the prop name. */
  label?: string;
  /** Optional helper text displayed under the control. */
  description?: ReactNode;
  /** Optional dependency list evaluated when rendering code samples. */
  dependencies?: InteractiveDemoDependency[];
}

export interface InteractiveDemoBooleanControl
  extends InteractiveDemoBaseControl {
  control: "boolean";
  defaultValue?: boolean;
  /** Omit the prop when false instead of rendering `prop={false}`. */
  omitIfFalse?: boolean;
}

export interface InteractiveDemoSelectControl
  extends InteractiveDemoBaseControl {
  control: "select";
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
  /** Omit the prop when it equals this value. */
  omitIfValue?: string;
}

export interface InteractiveDemoTextControl
  extends InteractiveDemoBaseControl {
  control: "text";
  placeholder?: string;
  defaultValue?: string;
  /** Trim whitespace before evaluating omissions. */
  trim?: boolean;
  /** Omit the prop if the resolved value is empty. */
  omitIfEmpty?: boolean;
  /** Slot metadata for child composition (e.g., avatar, icon). */
  slots?: InteractiveDemoSlotConfig;
}

export interface InteractiveDemoSharedConfig {
  /** Default props passed to the component before any control changes. */
  initialProps?: Record<string, unknown>;
  /** Manual control definitions configured by the MDX author. */
  controls?: InteractiveDemoControl[];
  /** Optional description displayed above the controls. */
  description?: ReactNode;
  /** JSX template used to render code. */
  jsxTemplate: JSXTemplate;
}

export interface JSXTemplate {
  imports: JSXTemplateImport[];
  tree: JSXTemplateElement;
}

export interface JSXTemplateImport {
  module: string;
  members: string[];
}

export type JSXTemplateChild = JSXTemplateElement | JSXTemplateText;

export interface JSXTemplateElement {
  type: "element";
  name: string;
  props?: JSXTemplateProp[];
  children?: JSXTemplateChild[];
  condition?: JSXTemplateCondition;
}

export interface JSXTemplateText {
  type: "text";
  value?: string;
  prop?: string;
  trim?: boolean;
}

export type JSXTemplateProp =
  | JSXTemplateLiteralProp
  | JSXTemplateStringProp
  | JSXTemplateBooleanProp
  | JSXTemplateEnumProp;

export interface JSXTemplateLiteralProp {
  kind: "literal";
  name: string;
  value: string | number | boolean;
}

export interface JSXTemplateStringProp {
  kind: "string";
  name: string;
  prop: string;
  trim?: boolean;
  omitIfEmpty?: boolean;
}

export interface JSXTemplateBooleanProp {
  kind: "boolean";
  name: string;
  prop: string;
  omitIfFalse?: boolean;
}

export interface JSXTemplateEnumProp {
  kind: "enum";
  name: string;
  prop: string;
  values: Record<string, string>;
  omitIfValue?: string;
}

export type JSXTemplateCondition =
  | {
      kind: "propTruthy";
      prop: string;
      trim?: boolean;
    }
  | {
      kind: "propEquals";
      prop: string;
      value: unknown;
    }
  | {
      kind: "propNotEmpty";
      prop: string;
      trim?: boolean;
    };

