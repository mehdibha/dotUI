"use client"

import { type ReactNode, useMemo, useState } from "react"
import { GridList, GridListItem } from "react-aria-components/GridList"
import {
  DropIndicator,
  isTextDropItem,
  useDragAndDrop,
} from "react-aria-components/useDragAndDrop"

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CopyIcon,
  EyeIcon,
  GripVerticalIcon,
  InboxIcon,
  LayoutGridIcon,
  ListFilterIcon,
  ListIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  SignalHighIcon,
  Trash2Icon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* --------------------------------- Data ---------------------------------- */

type ColumnId = "backlog" | "in-progress" | "review" | "done"
type PriorityId = "urgent" | "high" | "medium" | "low"
type MemberId = "priya" | "marcus" | "yuki" | "elena" | "tom" | "aisha"

interface Task {
  id: string
  title: string
  summary: string
  tags: string[]
  priority: PriorityId
  /** ISO date, so string comparison is also chronological order. */
  due: string
  assignee: MemberId
  comments: number
  attachments: number
  column: ColumnId
}

const TODAY = "2026-08-22"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const formatDue = (iso: string) => {
  const [, month, day] = iso.split("-")
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`
}

const isOverdue = (task: Task) => task.column !== "done" && task.due < TODAY

const MEMBER_ORDER: MemberId[] = [
  "priya",
  "marcus",
  "yuki",
  "elena",
  "tom",
  "aisha",
]

const MEMBERS = {
  priya: { name: "Priya Raghavan", initials: "PR" },
  marcus: { name: "Marcus Webb", initials: "MW" },
  yuki: { name: "Yuki Tanaka", initials: "YT" },
  elena: { name: "Elena Vasquez", initials: "EV" },
  tom: { name: "Tom Brennan", initials: "TB" },
  aisha: { name: "Aisha Okonkwo", initials: "AO" },
} satisfies Record<MemberId, { name: string; initials: string }>

const COLUMN_ORDER: ColumnId[] = ["backlog", "in-progress", "review", "done"]

const COLUMNS = {
  backlog: {
    name: "Backlog",
    icon: CircleDashedIcon,
    hint: "Groomed and estimated",
  },
  "in-progress": {
    name: "In progress",
    icon: CircleDotIcon,
    hint: "Limit 4 per engineer",
  },
  review: { name: "Review", icon: EyeIcon, hint: "Needs a second pair" },
  done: {
    name: "Done",
    icon: CircleCheckIcon,
    hint: "Shipped this sprint",
  },
} satisfies Record<
  ColumnId,
  { name: string; icon: typeof CircleDotIcon; hint: string }
>

const PRIORITY_ORDER: PriorityId[] = ["urgent", "high", "medium", "low"]

const PRIORITIES = {
  urgent: { label: "Urgent", rank: 0, variant: "danger" },
  high: { label: "High", rank: 1, variant: "warning" },
  medium: { label: "Medium", rank: 2, variant: "info" },
  low: { label: "Low", rank: 3, variant: "neutral" },
} satisfies Record<
  PriorityId,
  {
    label: string
    rank: number
    variant: "danger" | "warning" | "info" | "neutral"
  }
>

const INITIAL_TASKS: Task[] = [
  {
    id: "ATL-412",
    title: "Live ETA recalculation on route change",
    summary:
      "Recompute arrival windows when dispatch reorders stops mid-shift.",
    tags: ["Routing", "Maps"],
    priority: "urgent",
    due: "2026-08-22",
    assignee: "priya",
    comments: 9,
    attachments: 3,
    column: "in-progress",
  },
  {
    id: "ATL-408",
    title: "Redesign the dispatch board filters",
    summary: "Depot, driver and vehicle filters collapse into one popover.",
    tags: ["Design", "Web"],
    priority: "high",
    due: "2026-08-25",
    assignee: "aisha",
    comments: 6,
    attachments: 2,
    column: "in-progress",
  },
  {
    id: "ATL-399",
    title: "Migrate telemetry ingest to Kafka",
    summary: "Move the 40k events/min feed off the legacy queue.",
    tags: ["Platform"],
    priority: "medium",
    due: "2026-08-30",
    assignee: "marcus",
    comments: 4,
    attachments: 0,
    column: "in-progress",
  },
  {
    id: "ATL-421",
    title: "Driver payout summary export",
    summary: "Weekly CSV with per-trip bonuses and deductions.",
    tags: ["Billing"],
    priority: "high",
    due: "2026-08-21",
    assignee: "elena",
    comments: 5,
    attachments: 2,
    column: "review",
  },
  {
    id: "ATL-417",
    title: "Fix timezone drift in shift reports",
    summary: "Depots on DST boundaries logged shifts an hour short.",
    tags: ["Bug", "Reports"],
    priority: "urgent",
    due: "2026-08-20",
    assignee: "yuki",
    comments: 12,
    attachments: 1,
    column: "review",
  },
  {
    id: "ATL-405",
    title: "Onboarding checklist for new depots",
    summary: "Eight steps from contract signed to first dispatch.",
    tags: ["Onboarding"],
    priority: "low",
    due: "2026-08-26",
    assignee: "tom",
    comments: 2,
    attachments: 0,
    column: "review",
  },
  {
    id: "ATL-430",
    title: "Offline mode for driver check-ins",
    summary: "Queue check-ins locally and sync when signal returns.",
    tags: ["Mobile", "Sync"],
    priority: "high",
    due: "2026-08-29",
    assignee: "yuki",
    comments: 4,
    attachments: 1,
    column: "backlog",
  },
  {
    id: "ATL-433",
    title: "Rate-limit the public tracking API",
    summary: "Per-token buckets, 600 req/min, with a clear retry header.",
    tags: ["API", "Security"],
    priority: "high",
    due: "2026-08-27",
    assignee: "marcus",
    comments: 3,
    attachments: 0,
    column: "backlog",
  },
  {
    id: "ATL-436",
    title: "Audit trail for dispatch overrides",
    summary: "Record who overrode an assignment, when and why.",
    tags: ["Compliance"],
    priority: "medium",
    due: "2026-09-03",
    assignee: "elena",
    comments: 2,
    attachments: 0,
    column: "backlog",
  },
  {
    id: "ATL-441",
    title: "Bulk CSV import for fleet vehicles",
    summary: "Validate VIN, plate and depot before the write.",
    tags: ["Imports"],
    priority: "low",
    due: "2026-09-11",
    assignee: "tom",
    comments: 1,
    attachments: 1,
    column: "backlog",
  },
  {
    id: "ATL-388",
    title: "Two-factor enrollment for admins",
    summary: "TOTP with eight single-use recovery codes.",
    tags: ["Security"],
    priority: "high",
    due: "2026-08-18",
    assignee: "aisha",
    comments: 7,
    attachments: 0,
    column: "done",
  },
  {
    id: "ATL-374",
    title: "Vehicle detail page skeleton states",
    summary: "Replace the spinner with per-section skeletons.",
    tags: ["Web"],
    priority: "medium",
    due: "2026-08-15",
    assignee: "priya",
    comments: 3,
    attachments: 1,
    column: "done",
  },
  {
    id: "ATL-361",
    title: "Webhook retries with backoff",
    summary: "Six attempts over 24h, then a dead-letter queue.",
    tags: ["API"],
    priority: "medium",
    due: "2026-08-14",
    assignee: "marcus",
    comments: 5,
    attachments: 0,
    column: "done",
  },
]

/* ------------------------------- Primitives ------------------------------- */

function PriorityBadge({ priority }: { priority: PriorityId }) {
  const { label, variant } = PRIORITIES[priority]
  return (
    <Badge variant={variant} appearance="subtle" size="sm">
      <SignalHighIcon />
      {label}
    </Badge>
  )
}

function MemberAvatar({
  member,
  size = "sm",
}: {
  member: MemberId
  size?: "sm" | "md"
}) {
  const { name, initials } = MEMBERS[member]
  return (
    <Avatar size={size} aria-label={name}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

function TaskMenu({
  task,
  onMove,
  onDelete,
}: {
  task: Task
  onMove: (id: string, direction: -1 | 1) => void
  onDelete: (id: string) => void
}) {
  const index = COLUMN_ORDER.indexOf(task.column)
  const previous = COLUMN_ORDER[index - 1]
  const next = COLUMN_ORDER[index + 1]
  return (
    <Menu>
      <Button
        variant="quiet"
        size="xs"
        isIconOnly
        aria-label={`Actions for ${task.title}`}
        className="-mt-1 -mr-1 text-fg-muted"
      >
        <MoreHorizontalIcon />
      </Button>
      <Popover className="min-w-48" placement="bottom end">
        <MenuContent>
          <MenuSection>
            <MenuSectionHeader>{task.id}</MenuSectionHeader>
            <MenuItem>
              <PencilIcon />
              Edit task
            </MenuItem>
            <MenuItem>
              <CopyIcon />
              Copy link
            </MenuItem>
          </MenuSection>
          <Separator />
          <MenuSection>
            {previous && (
              <MenuItem onAction={() => onMove(task.id, -1)}>
                <ArrowLeftIcon />
                Move to {COLUMNS[previous].name}
              </MenuItem>
            )}
            {next && (
              <MenuItem onAction={() => onMove(task.id, 1)}>
                <ArrowRightIcon />
                Move to {COLUMNS[next].name}
              </MenuItem>
            )}
          </MenuSection>
          <Separator />
          <MenuItem variant="danger" onAction={() => onDelete(task.id)}>
            <Trash2Icon />
            Delete
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function TaskCard({
  task,
  onMove,
  onDelete,
}: {
  task: Task
  onMove: (id: string, direction: -1 | 1) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card
      size="sm"
      className="gap-2.5 transition-shadow hover:border-border-active hover:shadow-sm"
    >
      <CardHeader className="gap-1.5">
        <CardTitle className="text-sm leading-snug text-pretty">
          {task.title}
        </CardTitle>
        <CardAction className="flex items-center">
          <Button
            slot="drag"
            variant="quiet"
            size="xs"
            isIconOnly
            aria-label={`Drag ${task.title}`}
            className="-mt-1 cursor-grab text-fg-muted"
          >
            <GripVerticalIcon />
          </Button>
          <TaskMenu task={task} onMove={onMove} onDelete={onDelete} />
        </CardAction>
        <CardDescription className="line-clamp-2 text-xs">
          {task.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        {task.tags.map((tag) => (
          <Badge key={tag} appearance="subtle" size="sm">
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t pt-2.5">
        <div className="flex min-w-0 items-center gap-3 text-xs text-fg-muted">
          <span
            className={cn(
              "flex items-center gap-1",
              isOverdue(task) && "text-fg-danger",
            )}
          >
            <CalendarIcon className="size-3.5" />
            {formatDue(task.due)}
          </span>
          {task.comments > 0 && (
            <span className="flex items-center gap-1 tabular-nums">
              <MessageSquareIcon className="size-3.5" />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1 tabular-nums">
              <PaperclipIcon className="size-3.5" />
              {task.attachments}
            </span>
          )}
        </div>
        <Tooltip>
          <Button
            variant="quiet"
            size="xs"
            isIconOnly
            aria-label={`Assigned to ${MEMBERS[task.assignee].name}`}
          >
            <MemberAvatar member={task.assignee} />
          </Button>
          <TooltipContent>{MEMBERS[task.assignee].name}</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

/** Where dragged tasks land relative to an existing task; end of column if absent. */
interface DropTarget {
  key: string
  position: "before" | "after"
}

/** The drop target currently hovered/selected during a drag, board-wide. */
interface ActiveDrop {
  column: ColumnId
  type: "root" | "item"
  key?: string
  position?: string
}

const sameDrop = (a: ActiveDrop, b: ActiveDrop) =>
  a.column === b.column &&
  a.type === b.type &&
  a.key === b.key &&
  a.position === b.position

const noop = () => {}

/** Inert copy of the dragged card, used as drop placeholder and drag preview. */
function TaskCardGhost({
  task,
  className,
}: {
  task: Task
  className?: string
}) {
  return (
    <div inert className={cn("w-[280px] sm:w-[300px]", className)}>
      <TaskCard task={task} onMove={noop} onDelete={noop} />
    </div>
  )
}

function BoardColumn({
  id,
  tasks,
  isFiltered,
  draggedTask,
  activeDrop,
  onDragActive,
  onTargetEnter,
  onTargetExit,
  onMove,
  onDelete,
  onAdd,
  onDropTasks,
}: {
  id: ColumnId
  tasks: Task[]
  isFiltered: boolean
  /** The task currently being dragged, from any column. */
  draggedTask: Task | null
  /** The drop target currently hovered/selected anywhere on the board. */
  activeDrop: ActiveDrop | null
  onDragActive: (task: Task | null) => void
  onTargetEnter: (target: ActiveDrop) => void
  onTargetExit: (target: ActiveDrop) => void
  onMove: (id: string, direction: -1 | 1) => void
  onDelete: (id: string) => void
  onAdd: (column: ColumnId) => void
  onDropTasks: (ids: string[], target?: DropTarget) => void
}) {
  const { name, icon: Icon, hint } = COLUMNS[id]

  const describeTarget = (target: {
    type: string
    key?: unknown
    dropPosition?: string
  }): ActiveDrop => ({
    column: id,
    type: target.type === "root" ? "root" : "item",
    key: target.key != null ? String(target.key) : undefined,
    position: target.dropPosition,
  })

  const draggedIndex = draggedTask
    ? tasks.findIndex((task) => task.id === draggedTask.id)
    : -1

  /** Targets that resolve to where the dragged card already sits. */
  const isDropAtDraggedSlot = (target: ActiveDrop) => {
    if (target.column !== id || draggedIndex === -1) return false
    if (target.type === "root") return true
    if (target.key === draggedTask?.id) return true
    const prev = tasks[draggedIndex - 1]
    const next = tasks[draggedIndex + 1]
    return (
      (next != null &&
        target.key === next.id &&
        target.position === "before") ||
      (prev != null && target.key === prev.id && target.position === "after")
    )
  }

  // The source slot stays open in place until the drag targets a genuinely
  // new position; dropping "at the same slot" then changes nothing visually.
  const collapseDragSource =
    activeDrop != null && !isDropAtDraggedSlot(activeDrop)

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => {
        const task = tasks.find((candidate) => candidate.id === key)
        return {
          "kanban-task": String(key),
          "text/plain": task ? `${task.id} ${task.title}` : String(key),
        }
      }),
    acceptedDragTypes: ["kanban-task"],
    getDropOperation: () => "move",
    onDragStart: (e) => {
      const [key] = [...e.keys]
      onDragActive(tasks.find((task) => task.id === key) ?? null)
    },
    onDragEnd: () => onDragActive(null),
    onDropEnter: (e) => onTargetEnter(describeTarget(e.target)),
    onDropExit: (e) => onTargetExit(describeTarget(e.target)),
    renderDragPreview: (items) => {
      const dragged = tasks.find(
        (task) => task.id === items[0]?.["kanban-task"],
      )
      return dragged ? (
        <TaskCardGhost task={dragged} className="rounded-lg shadow-lg" />
      ) : (
        <div className="flex max-w-64 items-center rounded-md border bg-bg px-3 py-2 text-sm shadow-md">
          <span className="truncate">{items[0]?.["text/plain"]}</span>
        </div>
      )
    },
    // Every indicator holds a ghost of the dragged card inside a collapsed
    // 0fr grid track; the active one expands so surrounding cards slide
    // instead of jumping. List spacing lives on item margins, not flex gap,
    // so the collapsed rows cost no space.
    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        // RAC nests children in a [role=gridcell] wrapper — it is the grid
        // child, so it must carry min-h-0/overflow-hidden for 0fr to collapse.
        // Indicators at the dragged card's own slot never expand — the open
        // source slot already shows that space.
        className={cn(
          "grid grid-rows-[0fr] outline-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none [&>[role=gridcell]]:min-h-0 [&>[role=gridcell]]:overflow-hidden",
          !isDropAtDraggedSlot(describeTarget(target)) &&
            "data-drop-target:grid-rows-[1fr] data-drop-target:starting:grid-rows-[0fr]",
        )}
      >
        {draggedTask ? (
          <TaskCardGhost
            task={draggedTask}
            className="invisible w-full pb-2.5"
          />
        ) : (
          <div className="mb-2.5 h-0.5 rounded-full bg-border-focus" />
        )}
      </DropIndicator>
    ),
    onReorder: (e) => {
      if (e.target.dropPosition === "on") return
      // Dropping at the card's own slot (e.g. before/after itself) is a no-op.
      if (isDropAtDraggedSlot(describeTarget(e.target))) return
      onDropTasks([...e.keys].map(String), {
        key: String(e.target.key),
        position: e.target.dropPosition,
      })
    },
    async onInsert(e) {
      if (e.target.dropPosition === "on") return
      const { key, dropPosition } = e.target
      const ids = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map((item) => item.getText("kanban-task")),
      )
      onDropTasks(ids, { key: String(key), position: dropPosition })
    },
    async onRootDrop(e) {
      const ids = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map((item) => item.getText("kanban-task")),
      )
      // A short drag resolves to the root target — the column's own cards
      // dropped there keep their position instead of jumping to the end.
      if (ids.every((id) => tasks.some((task) => task.id === id))) return
      onDropTasks(ids)
    },
  })
  return (
    <section className="flex w-[280px] shrink-0 flex-col gap-3 sm:w-[300px]">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-fg-muted" />
        <h2 className="text-sm font-medium">{name}</h2>
        <Badge appearance="subtle" size="sm" className="tabular-nums">
          {tasks.length}
        </Badge>
        <div className="ml-auto flex items-center gap-0.5">
          <Tooltip>
            <Button
              variant="quiet"
              size="xs"
              isIconOnly
              aria-label={`Add a task to ${name}`}
              onPress={() => onAdd(id)}
              className="text-fg-muted"
            >
              <PlusIcon />
            </Button>
            <TooltipContent>Add task</TooltipContent>
          </Tooltip>
          <Menu>
            <Button
              variant="quiet"
              size="xs"
              isIconOnly
              aria-label={`${name} column options`}
              className="text-fg-muted"
            >
              <MoreHorizontalIcon />
            </Button>
            <Popover className="min-w-44" placement="bottom end">
              <MenuContent>
                <MenuItem>
                  <PencilIcon />
                  Rename column
                </MenuItem>
                <MenuItem>
                  <EyeIcon />
                  Set work-in-progress limit
                </MenuItem>
                <MenuItem>
                  <InboxIcon />
                  Archive all tasks
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </div>

      <p className="-mt-1 text-xs text-fg-muted">{hint}</p>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto">
        <GridList
          aria-label={`${name} tasks`}
          items={tasks}
          dragAndDropHooks={dragAndDropHooks}
          renderEmptyState={() => (
            <Empty className="mb-2.5 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>Nothing here</EmptyTitle>
                <EmptyDescription>
                  {isFiltered
                    ? "No task matches the current filters."
                    : "No task in this column yet."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          className="-mb-2.5 flex flex-col rounded-lg focus-reset data-drop-target:focus-ring"
        >
          {(task) => (
            <GridListItem
              textValue={task.title}
              // While dragging, the card hides but its slot stays open in
              // place (the free space) until a real new position is targeted;
              // only then does the slot animate closed. The gridcell is
              // display:contents, so the wrapper below is the grid item; fr
              // interpolation needs its zero min-height.
              className={({ isDragging }) =>
                cn(
                  "group/row mb-2.5 grid grid-rows-[1fr] rounded-lg focus-reset transition-[grid-template-rows,margin] duration-200 ease-out data-focus-visible:focus-ring",
                  isDragging && collapseDragSource && "mb-0 grid-rows-[0fr]",
                )
              }
            >
              <div className="min-h-0 transition-opacity duration-200 group-data-[dragging]/row:overflow-hidden group-data-[dragging]/row:opacity-0">
                <TaskCard task={task} onMove={onMove} onDelete={onDelete} />
              </div>
            </GridListItem>
          )}
        </GridList>
        <Button
          variant="quiet"
          size="sm"
          onPress={() => onAdd(id)}
          className="w-full justify-start border border-dashed text-fg-muted"
        >
          <PlusIcon />
          Add task
        </Button>
      </div>
    </section>
  )
}

function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <TableContainer>
      <Table aria-label="Sprint tasks">
        <TableHeader>
          <TableColumn id="task" isRowHeader>
            Task
          </TableColumn>
          <TableColumn id="status">Status</TableColumn>
          <TableColumn id="priority">Priority</TableColumn>
          <TableColumn id="assignee">Assignee</TableColumn>
          <TableColumn id="due">Due</TableColumn>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} id={task.id}>
              <TableCell>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{task.title}</span>
                  <span className="font-mono text-xs text-fg-muted">
                    {task.id}
                  </span>
                </div>
              </TableCell>
              <TableCell>{COLUMNS[task.column].name}</TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MemberAvatar member={task.assignee} />
                  <span className="truncate">
                    {MEMBERS[task.assignee].name}
                  </span>
                </div>
              </TableCell>
              <TableCell className={cn(isOverdue(task) && "text-fg-danger")}>
                {formatDue(task.due)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

/* ------------------------------- New task --------------------------------- */

interface TaskDraft {
  title: string
  summary: string
  priority: PriorityId
  assignee: MemberId
  column: ColumnId
}

function NewTaskDialog({
  isOpen,
  onOpenChange,
  column,
  onColumnChange,
  onCreate,
  children,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  column: ColumnId
  onColumnChange: (column: ColumnId) => void
  onCreate: (draft: TaskDraft) => void
  /** The trigger button — the board also opens this dialog from each column. */
  children: ReactNode
}) {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [priority, setPriority] = useState<PriorityId>("medium")
  const [assignee, setAssignee] = useState<MemberId>("priya")

  const submit = () => {
    onCreate({
      title: title.trim() || "Untitled task",
      summary: summary.trim() || "No description yet.",
      priority,
      assignee,
      column,
    })
    setTitle("")
    setSummary("")
    onOpenChange(false)
  }

  const content = (
    <DialogContent showCloseButton>
      <DialogHeader>
        <DialogTitle>New task</DialogTitle>
        <DialogDescription>
          It lands in {COLUMNS[column].name} on the Sprint 24 board.
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <TextField value={title} onChange={setTitle} autoFocus>
          <Label>Title</Label>
          <Input placeholder="Add a depot capacity warning" />
        </TextField>
        <TextField value={summary} onChange={setSummary}>
          <Label>Description</Label>
          <TextArea placeholder="What needs to happen, and how we know it's done." />
        </TextField>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            value={column}
            onChange={(key) => onColumnChange(String(key) as ColumnId)}
          >
            <Label>Column</Label>
            <SelectTrigger />
            <SelectContent>
              {COLUMN_ORDER.map((id) => (
                <SelectItem key={id} id={id}>
                  {COLUMNS[id].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onChange={(key) => setPriority(String(key) as PriorityId)}
          >
            <Label>Priority</Label>
            <SelectTrigger />
            <SelectContent>
              {PRIORITY_ORDER.map((id) => (
                <SelectItem key={id} id={id}>
                  {PRIORITIES[id].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={assignee}
            onChange={(key) => setAssignee(String(key) as MemberId)}
          >
            <Label>Assignee</Label>
            <SelectTrigger />
            <SelectContent>
              {MEMBER_ORDER.map((id) => (
                <SelectItem key={id} id={id}>
                  {MEMBERS[id].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button variant="primary" onPress={submit}>
          Create task
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <Responsive
        render={(isMobile) =>
          isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            <Modal className="sm:max-w-lg">{content}</Modal>
          )
        }
      />
    </Dialog>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function KanbanBlock() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [query, setQuery] = useState("")
  const [priorities, setPriorities] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<Set<string>>(new Set(["manual"]))
  const [view, setView] = useState<"board" | "list">("board")
  const [isCreating, setCreating] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [activeDrop, setActiveDrop] = useState<ActiveDrop | null>(null)
  const [draftColumn, setDraftColumn] = useState<ColumnId>("backlog")
  const [nextNumber, setNextNumber] = useState(450)

  const sortKey = [...sort][0] ?? "manual"
  const isFiltered = query.trim().length > 0 || priorities.size > 0

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = tasks.filter((task) => {
      if (priorities.size > 0 && !priorities.has(task.priority)) return false
      if (!q) return true
      return `${task.id} ${task.title} ${task.summary} ${task.tags.join(" ")}`
        .toLowerCase()
        .includes(q)
    })
    if (sortKey === "priority") {
      return [...filtered].sort(
        (a, b) => PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank,
      )
    }
    if (sortKey === "due") {
      return [...filtered].sort((a, b) => a.due.localeCompare(b.due))
    }
    return filtered
  }, [tasks, query, priorities, sortKey])

  const moveTask = (id: string, direction: -1 | 1) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task
        const target =
          COLUMN_ORDER[COLUMN_ORDER.indexOf(task.column) + direction]
        return target ? { ...task, column: target } : task
      }),
    )
  }

  const dropTasks = (column: ColumnId, ids: string[], target?: DropTarget) => {
    setTasks((current) => {
      const moving = current
        .filter((task) => ids.includes(task.id))
        .map((task) => ({ ...task, column }))
      if (moving.length === 0) return current
      const rest = current.filter((task) => !ids.includes(task.id))
      const index = target
        ? rest.findIndex((task) => task.id === target.key)
        : -1
      // A target that is itself being dragged has no anchor left — bail
      // rather than misplacing the cards at the end.
      if (target && index === -1) return current
      const at =
        index === -1
          ? rest.length
          : target?.position === "after"
            ? index + 1
            : index
      return [...rest.slice(0, at), ...moving, ...rest.slice(at)]
    })
  }

  const deleteTask = (id: string) =>
    setTasks((current) => current.filter((task) => task.id !== id))

  const openCreate = (column: ColumnId) => {
    setDraftColumn(column)
    setCreating(true)
  }

  const createTask = (draft: TaskDraft) => {
    setTasks((current) => [
      {
        ...draft,
        id: `ATL-${nextNumber}`,
        tags: ["New"],
        due: "2026-09-05",
        comments: 0,
        attachments: 0,
      },
      ...current,
    ])
    setNextNumber((number) => number + 1)
  }

  const done = tasks.filter((task) => task.column === "done").length
  const completion = Math.round((done / Math.max(tasks.length, 1)) * 100)
  const activeFilters = priorities.size

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg text-fg">
      <header className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <SearchField
            aria-label="Search tasks"
            placeholder="Search tasks…"
            value={query}
            onChange={setQuery}
            className="w-full sm:w-64"
          />

          <Menu>
            <Button size="sm">
              <ListFilterIcon />
              Filter
              {activeFilters > 0 && (
                <Badge variant="accent" size="sm" className="tabular-nums">
                  {activeFilters}
                </Badge>
              )}
            </Button>
            <Popover className="min-w-48">
              <MenuContent
                selectionMode="multiple"
                selectedKeys={priorities}
                onSelectionChange={(keys) => {
                  if (keys !== "all") {
                    setPriorities(new Set([...keys].map(String)))
                  }
                }}
              >
                <MenuSection>
                  <MenuSectionHeader>Priority</MenuSectionHeader>
                  {PRIORITY_ORDER.map((id) => (
                    <MenuItem key={id} id={id}>
                      {PRIORITIES[id].label}
                    </MenuItem>
                  ))}
                </MenuSection>
              </MenuContent>
            </Popover>
          </Menu>

          <Menu>
            <Button size="sm">
              <ChevronsUpDownIcon />
              Sort
            </Button>
            <Popover className="min-w-44">
              <MenuContent
                selectionMode="single"
                selectedKeys={sort}
                onSelectionChange={(keys) => {
                  if (keys !== "all") setSort(new Set([...keys].map(String)))
                }}
              >
                <MenuSection>
                  <MenuSectionHeader>Order by</MenuSectionHeader>
                  <MenuItem id="manual">Manual</MenuItem>
                  <MenuItem id="priority">Priority</MenuItem>
                  <MenuItem id="due">Due date</MenuItem>
                </MenuSection>
              </MenuContent>
            </Popover>
          </Menu>

          <SegmentedControl
            aria-label="View"
            selectedKeys={[view]}
            onSelectionChange={(keys) => {
              const [first] = [...keys]
              if (first) setView(String(first) as "board" | "list")
            }}
          >
            <SegmentedControlItem id="board">
              <LayoutGridIcon />
              Board
            </SegmentedControlItem>
            <SegmentedControlItem id="list">
              <ListIcon />
              List
            </SegmentedControlItem>
          </SegmentedControl>

          <div className="ml-auto flex items-center gap-3">
            <ProgressBar
              value={completion}
              aria-label="Sprint completion"
              className="hidden w-48 gap-1 lg:flex"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-fg-muted">
                <span>
                  {done} of {tasks.length} done
                </span>
                <ProgressBarOutput />
              </div>
              <ProgressBarControl />
            </ProgressBar>
            <AvatarGroup>
              {MEMBER_ORDER.slice(0, 4).map((member) => (
                <MemberAvatar key={member} member={member} size="md" />
              ))}
              <AvatarGroupCount>+{MEMBER_ORDER.length - 4}</AvatarGroupCount>
            </AvatarGroup>
            <Separator orientation="vertical" className="h-6" />
            <NewTaskDialog
              isOpen={isCreating}
              onOpenChange={setCreating}
              column={draftColumn}
              onColumnChange={setDraftColumn}
              onCreate={createTask}
            >
              <Button
                variant="primary"
                size="sm"
                onPress={() => setDraftColumn("backlog")}
              >
                <PlusIcon />
                New task
              </Button>
            </NewTaskDialog>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        {view === "board" ? (
          <div className="flex h-full items-stretch gap-4 overflow-x-auto px-4 py-6 sm:px-6">
            {COLUMN_ORDER.map((id) => (
              <BoardColumn
                key={id}
                id={id}
                tasks={visible.filter((task) => task.column === id)}
                isFiltered={isFiltered}
                draggedTask={draggedTask}
                activeDrop={activeDrop}
                onDragActive={(task) => {
                  setDraggedTask(task)
                  if (!task) setActiveDrop(null)
                }}
                onTargetEnter={setActiveDrop}
                onTargetExit={(target) =>
                  setActiveDrop((current) =>
                    current && sameDrop(current, target) ? null : current,
                  )
                }
                onMove={moveTask}
                onDelete={deleteTask}
                onAdd={openCreate}
                onDropTasks={(ids, target) => dropTasks(id, ids, target)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-4 py-6 sm:px-6">
            <TaskTable tasks={visible} />
          </div>
        )}
      </main>
    </div>
  )
}
