'use client'

import type { Edge, Node } from '@xyflow/react'

import { FlowEditor } from '@/registry/ui/flow-editor'

const nodes: Node[] = [
  {
    id: 'trigger',
    type: 'input',
    position: { x: 120, y: 0 },
    data: { label: 'New signup' },
  },
  {
    id: 'enrich',
    position: { x: 0, y: 130 },
    data: { label: 'Enrich profile' },
  },
  {
    id: 'notify',
    position: { x: 240, y: 130 },
    data: { label: 'Notify team' },
  },
  {
    id: 'done',
    type: 'output',
    position: { x: 120, y: 260 },
    data: { label: 'Onboarded' },
  },
]

const edges: Edge[] = [
  { id: 'e-trigger-enrich', source: 'trigger', target: 'enrich' },
  { id: 'e-trigger-notify', source: 'trigger', target: 'notify' },
  { id: 'e-enrich-done', source: 'enrich', target: 'done' },
  { id: 'e-notify-done', source: 'notify', target: 'done' },
]

export default function Demo() {
  return (
    <FlowEditor
      className="w-full max-w-xl"
      initialNodes={nodes}
      initialEdges={edges}
    />
  )
}
