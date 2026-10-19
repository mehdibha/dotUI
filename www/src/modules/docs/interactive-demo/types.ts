// Controls are built and enriched at build time, then passed as JSON props to the client component.

import type { MdxJsxFlowElementHast } from "mdast-util-mdx-jsx"

import type { CodeTemplate } from "../codegen/code-template"

export interface ControlReference {
  description?: string
  /** Highlighted type as an HTML string. */
  typeHighlighted: string
}

export interface BaseControl {
  name: string
  /** Required by the component: the code panel always shows it. */
  required?: boolean
  reference?: ControlReference
  /** The component's own default, from the API reference. The code panel omits the prop only at this value. */
  propDefault?: string | number | boolean
}

export interface BooleanControl extends BaseControl {
  type: "boolean"
  defaultValue?: boolean
}

export interface StringControl extends BaseControl {
  type: "string"
  defaultValue?: string
  placeholder?: string
}

export interface NumberControl extends BaseControl {
  type: "number"
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  /** Render as a select over these values instead of a number field. */
  options?: number[]
}

export interface EnumControl extends BaseControl {
  type: "enum"
  options: string[]
  defaultValue?: string
}

export interface IconControl extends BaseControl {
  type: "icon"
  /** Key of `availableIcons`; the picker's initial selection. */
  defaultValue?: string
}

export type Control =
  | BooleanControl
  | StringControl
  | NumberControl
  | EnumControl
  | IconControl

export type ControlValues = Record<string, unknown>

/**
 * Simplified control input for InteractiveDemo.
 * Can be just a prop name (string) or a partial control definition with overrides.
 */
export type ControlInput =
  | string
  | (Partial<Omit<Control, "name">> & { name: string })

/**
 * Node info collected during rehype traversal.
 */
export interface InteractiveDemoNodeInfo {
  node: MdxJsxFlowElementHast
  name: string
  controls: ControlInput[]
  /** Demo file slug under demos/ (default "playground"). */
  file?: string
}

/**
 * Processed InteractiveDemo ready for transformation.
 */
export interface ProcessedInteractiveDemo {
  nodeInfo: InteractiveDemoNodeInfo
  /** Import name for the playground component (e.g., "ButtonPlayground") */
  importName: string
  /** Import path for the playground component */
  importPath: string
  /** Controls with their highlighted reference data */
  controls: Control[]
  /** Template-with-holes over the demo source; fills the displayed code. */
  codeTemplate: CodeTemplate
}
