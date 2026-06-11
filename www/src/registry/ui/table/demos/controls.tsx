import type { ReactNode } from 'react'
import { MoreHorizontalIcon, PencilIcon } from 'lucide-react'

import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Dialog } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/registry/ui/table'

const statuses = ['Backlog', 'Todo', 'In Progress', 'Done'] as const
const statusVariant = {
  Backlog: 'neutral',
  Done: 'success',
  'In Progress': 'info',
  Todo: 'warning',
} as const

const assignees = [
  { id: 'maya', name: 'Maya Chen' },
  { id: 'owen', name: 'Owen Diaz' },
  { id: 'nora', name: 'Nora Smith' },
  { id: 'amir', name: 'Amir Khan' },
]

const tasks: Task[] = [
  {
    id: 'task-1',
    task: 'Finalize onboarding',
    status: 'In Progress',
    assignee: 'maya',
    estimate: 6,
    due: 'May 20',
  },
  {
    id: 'task-2',
    task: 'Review audit logs',
    status: 'Todo',
    assignee: 'owen',
    estimate: 3,
    due: 'May 21',
  },
  {
    id: 'task-3',
    task: 'Ship billing copy',
    status: 'Backlog',
    assignee: 'nora',
    estimate: 2,
    due: 'May 24',
  },
  {
    id: 'task-4',
    task: 'Tune empty states',
    status: 'Done',
    assignee: 'amir',
    estimate: 4,
    due: 'May 25',
  },
  {
    id: 'task-5',
    task: 'Validate invite flow',
    status: 'Todo',
    assignee: 'maya',
    estimate: 5,
    due: 'May 27',
  },
]

export default function Demo() {
  return (
    <TableContainer>
      <Table
        aria-label="Editable tasks"
        selectionMode="multiple"
        shouldSelectOnPressUp
      >
        <TableHeader>
          <TableColumn isRowHeader>Task</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Assignee</TableColumn>
          <TableColumn>Estimate</TableColumn>
          <TableColumn>Due</TableColumn>
          <TableColumn className="w-10">
            <span className="sr-only">Actions</span>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} textValue={task.task}>
              <TableCell className="font-medium">{task.task}</TableCell>
              <TableCell>
                <Badge appearance="subtle" variant={statusVariant[task.status]}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  aria-label={`Assignee for ${task.task}`}
                  defaultSelectedKey={task.assignee}
                >
                  <SelectTrigger size="sm" className="w-36" />
                  <SelectContent placement="bottom">
                    {assignees.map((assignee) => (
                      <SelectItem id={assignee.id} key={assignee.id}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <EditableCellControl
                  label={`Edit estimate for ${task.task}`}
                  value={`${task.estimate}h`}
                >
                  <Input
                    aria-label={`Estimate for ${task.task}`}
                    type="number"
                    min={1}
                    defaultValue={String(task.estimate)}
                    size="sm"
                    autoFocus
                    className="w-full text-right tabular-nums"
                  />
                </EditableCellControl>
              </TableCell>
              <TableCell>{task.due}</TableCell>
              <TableCell className="text-right">
                <Menu>
                  <Button
                    aria-label={`Open actions for ${task.task}`}
                    variant="quiet"
                    size="sm"
                    isIconOnly
                    className="-mr-1"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent>
                      <MenuItem>Edit task</MenuItem>
                      <MenuItem>Duplicate</MenuItem>
                      <MenuItem>Archive</MenuItem>
                      <MenuItem variant="danger">Delete</MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function EditableCellControl({
  children,
  label,
  value,
}: {
  children: ReactNode
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <span className="min-w-0 truncate">{value}</span>
      <Dialog>
        <Button
          aria-label={label}
          variant="quiet"
          size="sm"
          isIconOnly
          className="-mr-1"
        >
          <PencilIcon />
        </Button>
        <Popover aria-label={label} placement="bottom end" className="w-48 p-2">
          {children}
        </Popover>
      </Dialog>
    </div>
  )
}

interface Task {
  id: string
  assignee: string
  due: string
  estimate: number
  status: (typeof statuses)[number]
  task: string
}
