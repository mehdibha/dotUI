import { addDays, startOfDay } from 'date-fns'

import { Gantt } from '@/registry/ui/gantt'
import type { GanttTask } from '@/registry/ui/gantt'

const today = startOfDay(new Date())

const tasks: GanttTask[] = [
  {
    id: 'research',
    name: 'Research',
    start: today,
    end: addDays(today, 3),
    color: 'bg-primary',
  },
  {
    id: 'design',
    name: 'Design',
    start: addDays(today, 3),
    end: addDays(today, 7),
    color: 'bg-accent text-fg-on-accent',
  },
  {
    id: 'build',
    name: 'Build',
    start: addDays(today, 6),
    end: addDays(today, 13),
    color: 'bg-success text-fg-on-success',
  },
  {
    id: 'qa',
    name: 'QA & Review',
    start: addDays(today, 12),
    end: addDays(today, 16),
    color: 'bg-warning text-fg-on-warning',
  },
  {
    id: 'launch',
    name: 'Launch',
    start: addDays(today, 16),
    end: addDays(today, 18),
    color: 'bg-info text-fg-on-info',
  },
]

export default function Demo() {
  return (
    <div className="w-full max-w-3xl">
      <Gantt tasks={tasks} />
    </div>
  )
}
