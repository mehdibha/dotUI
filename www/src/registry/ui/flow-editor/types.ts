import type { Edge, Node, ReactFlowProps } from '@xyflow/react'

/**
 * A node/flow editor built on React Flow. Renders an interactive canvas with a
 * background grid, zoom/pan controls, and a minimap inside a bordered,
 * fixed-height container. Nodes and edges are managed internally; new edges are
 * created when the user connects two handles.
 *
 * Accepts any other `ReactFlow` prop (except the internally-managed `nodes`,
 * `edges`, and `onConnect`).
 */
export interface FlowEditorProps extends Omit<
  ReactFlowProps,
  'nodes' | 'edges' | 'onConnect'
> {
  /**
   * The nodes the editor starts with.
   * @default a three-node input → process → output graph
   */
  initialNodes?: Node[]

  /**
   * The edges the editor starts with.
   * @default edges connecting the three default nodes
   */
  initialEdges?: Edge[]
}
