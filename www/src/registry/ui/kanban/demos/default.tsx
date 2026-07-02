'use client'

import * as React from 'react'

import {
  KanbanBoard,
  KanbanCard,
  KanbanCardList,
  KanbanColumn,
  KanbanColumnCount,
  KanbanColumnHeader,
  KanbanColumnTitle,
  KanbanDragOverlay,
} from '@/registry/ui/kanban'
import type { KanbanColumnData } from '@/registry/ui/kanban'

interface Task {
  id: string
  title: string
  assignee: number
}

type Column = KanbanColumnData<Task> & { title: string }

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To do',
    items: [
      { id: 't-1', title: 'Audit onboarding funnel', assignee: 12 },
      { id: 't-2', title: 'Draft Q3 roadmap', assignee: 5 },
      { id: 't-3', title: 'Refresh marketing copy', assignee: 32 },
    ],
  },
  {
    id: 'in-progress',
    title: 'In progress',
    items: [
      { id: 't-4', title: 'Build settings page', assignee: 8 },
      { id: 't-5', title: 'Migrate auth to OAuth', assignee: 19 },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [{ id: 't-6', title: 'Ship dark mode', assignee: 24 }],
  },
]

export default function Demo() {
  const [columns, setColumns] = React.useState<Column[]>(initialColumns)

  const taskById = React.useMemo(() => {
    const map = new Map<string, Task>()
    for (const column of columns) {
      for (const item of column.items) map.set(item.id, item)
    }
    return map
  }, [columns])

  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={setColumns}
      className="w-full max-w-2xl pb-2"
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          itemIds={column.items.map((item) => item.id)}
        >
          <KanbanColumnHeader>
            <KanbanColumnTitle>{column.title}</KanbanColumnTitle>
            <KanbanColumnCount>{column.items.length}</KanbanColumnCount>
          </KanbanColumnHeader>
          <KanbanCardList>
            {column.items.map((task) => (
              <KanbanCard key={task.id} id={task.id} className="cursor-grab">
                <TaskContent task={task} />
              </KanbanCard>
            ))}
          </KanbanCardList>
        </KanbanColumn>
      ))}
      <KanbanDragOverlay>
        {(activeId) => {
          const task = taskById.get(String(activeId))
          return task ? (
            <div className="rounded-(--kanban-radius) border bg-card p-3 text-sm shadow-md">
              <TaskContent task={task} />
            </div>
          ) : null
        }}
      </KanbanDragOverlay>
    </KanbanBoard>
  )
}

function TaskContent({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium">{task.title}</span>
      <img
        src={`https://i.pravatar.cc/80?img=${task.assignee}`}
        alt=""
        className="size-6 shrink-0 rounded-full"
      />
    </div>
  )
}
