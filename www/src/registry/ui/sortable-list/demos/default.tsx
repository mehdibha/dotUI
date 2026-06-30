'use client'

import { useState } from 'react'

import {
  SortableItem,
  SortableItemContent,
  SortableItemHandle,
  SortableList,
} from '@/registry/ui/sortable-list'

interface Task {
  id: string
  title: string
}

const initialTasks: Task[] = [
  { id: '1', title: 'Draft the launch announcement' },
  { id: '2', title: 'Review pull request #42' },
  { id: '3', title: 'Sync with the design team' },
  { id: '4', title: 'Update the changelog' },
]

export default function Demo() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  return (
    <SortableList
      items={tasks}
      onReorder={setTasks}
      className="w-full max-w-md"
    >
      {(task) => (
        <SortableItem id={task.id}>
          <SortableItemHandle />
          <SortableItemContent>{task.title}</SortableItemContent>
        </SortableItem>
      )}
    </SortableList>
  )
}
