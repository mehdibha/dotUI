'use client'

import '@xyflow/react/dist/style.css'

import * as React from 'react'
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type { Connection, Edge, Node, ReactFlowProps } from '@xyflow/react'

import { useStyles } from './styles'

// MARK: defaults

const DEFAULT_NODES: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Input' },
    type: 'input',
  },
  {
    id: '2',
    position: { x: 0, y: 120 },
    data: { label: 'Process' },
  },
  {
    id: '3',
    position: { x: 0, y: 240 },
    data: { label: 'Output' },
    type: 'output',
  },
]

const DEFAULT_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
]

// MARK: FlowEditor

interface FlowEditorProps extends Omit<
  ReactFlowProps,
  'nodes' | 'edges' | 'onConnect'
> {
  /** Nodes the editor starts with. */
  initialNodes?: Node[]
  /** Edges the editor starts with. */
  initialEdges?: Edge[]
  /** Class applied to the bordered container. */
  className?: string
}

function FlowEditor({
  initialNodes = DEFAULT_NODES,
  initialEdges = DEFAULT_EDGES,
  className,
  ...props
}: FlowEditorProps) {
  const { root, flow } = useStyles()()
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // React Flow measures the DOM on mount, so it can't render during SSR /
  // prerendering — gate it behind a client-only mount.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const onConnect = React.useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges],
  )

  return (
    <div className={root({ className })}>
      {mounted && (
        <ReactFlow
          className={flow()}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
          {...props}
        >
          <Background />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      )}
    </div>
  )
}

export type { FlowEditorProps }
export { FlowEditor }
