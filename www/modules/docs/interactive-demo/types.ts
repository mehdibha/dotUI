import type { ReactNode } from "react";

export type InteractiveDemoControl =
  | InteractiveDemoBooleanControl
  | InteractiveDemoSelectControl
  | InteractiveDemoTextControl;

interface InteractiveDemoBaseControl {
  /** Name of the prop to update on the component. */
  prop: string;
  /** Optional UI label, falls back to the prop name. */
  label?: string;
  /** Optional helper text displayed under the control. */
  description?: ReactNode;
}

export interface InteractiveDemoBooleanControl
  extends InteractiveDemoBaseControl {
  control: "boolean";
  defaultValue?: boolean;
}

export interface InteractiveDemoSelectControl
  extends InteractiveDemoBaseControl {
  control: "select";
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
}

export interface InteractiveDemoTextControl
  extends InteractiveDemoBaseControl {
  control: "text";
  placeholder?: string;
  defaultValue?: string;
}

export interface InteractiveDemoSharedConfig {
  /** Default props passed to the component before any control changes. */
  initialProps?: Record<string, unknown>;
  /** Manual control definitions configured by the MDX author. */
  controls?: InteractiveDemoControl[];
  /** Display name used for the generated code sample. */
  componentName?: string;
  /** Module path used for the import statement. */
  importPath?: string;
  /** Optional description displayed above the controls. */
  description?: ReactNode;
}

