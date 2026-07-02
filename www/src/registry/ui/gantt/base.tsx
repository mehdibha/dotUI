'use client'

import * as React from 'react'
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isToday,
  startOfDay,
} from 'date-fns'

import { useStyles } from './styles'

// MARK: ganttStyles

// MARK: helpers

/** Width of a single day column, in pixels. */
const DAY_WIDTH = 40

interface GanttTask {
  /** Unique identifier for the task. */
  id: string
  /** Display name shown in the sidebar and on the bar. */
  name: string
  /** Start date of the task (inclusive). */
  start: Date
  /** End date of the task (inclusive). */
  end: Date
  /**
   * Tailwind background class for the task bar. Defaults to `bg-primary`.
   */
  color?: string
}

/** The smallest and largest dates across every task. */
function tasksExtent(tasks: readonly GanttTask[]): {
  min: Date
  max: Date
} | null {
  let min: Date | null = null
  let max: Date | null = null
  for (const task of tasks) {
    const start = startOfDay(task.start)
    const end = startOfDay(task.end)
    if (min === null || start < min) min = start
    if (max === null || end > max) max = end
  }
  if (min === null || max === null) return null
  return { min, max }
}

// MARK: Gantt

interface GanttProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The tasks to lay out on the timeline. */
  tasks: readonly GanttTask[]
  /**
   * Start of the visible timeline range. Defaults to the earliest task start,
   * padded by two days.
   */
  start?: Date
  /**
   * End of the visible timeline range. Defaults to the latest task end, padded
   * by two days.
   */
  end?: Date
}

function Gantt({ tasks, start, end, className, ...props }: GanttProps) {
  const {
    root,
    sidebar,
    sidebarHeader,
    sidebarRow,
    timeline,
    grid,
    header,
    headerCell,
    headerWeekday,
    headerDay,
    body,
    row,
    cell,
    bar,
    barLabel,
    today,
  } = useStyles()()

  const { rangeStart, days } = React.useMemo(() => {
    const extent = tasksExtent(tasks)
    const fallback = startOfDay(new Date())
    const rangeStart = start
      ? startOfDay(start)
      : extent
        ? new Date(extent.min.getTime() - 2 * 86_400_000)
        : fallback
    const rangeEnd = end
      ? startOfDay(end)
      : extent
        ? new Date(extent.max.getTime() + 2 * 86_400_000)
        : fallback
    // Guard against an inverted range so eachDayOfInterval never throws.
    const safeEnd = rangeEnd < rangeStart ? rangeStart : rangeEnd
    return {
      rangeStart,
      days: eachDayOfInterval({ start: rangeStart, end: safeEnd }),
    }
  }, [tasks, start, end])

  const totalWidth = days.length * DAY_WIDTH
  const todayOffset = differenceInCalendarDays(
    startOfDay(new Date()),
    rangeStart,
  )
  const showToday = todayOffset >= 0 && todayOffset < days.length

  return (
    <div data-gantt="" className={root({ className })} {...props}>
      <div data-gantt-sidebar="" className={sidebar()}>
        <div className={sidebarHeader()}>Task</div>
        {tasks.map((task) => (
          <div key={task.id} className={sidebarRow()} title={task.name}>
            {task.name}
          </div>
        ))}
      </div>

      <div data-gantt-timeline="" className={timeline()}>
        <div className={grid()} style={{ width: totalWidth }}>
          <div data-gantt-header="" className={header()}>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={headerCell()}
                style={{ width: DAY_WIDTH }}
                data-today={isToday(day) ? '' : undefined}
              >
                <span className={headerWeekday()}>{format(day, 'EEEEE')}</span>
                <span className={headerDay()}>{format(day, 'd')}</span>
              </div>
            ))}
          </div>

          <div data-gantt-body="" className={body()}>
            {showToday && (
              <div
                data-gantt-today=""
                className={today()}
                style={{ left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }}
              />
            )}

            {tasks.map((task) => {
              const offset = differenceInCalendarDays(
                startOfDay(task.start),
                rangeStart,
              )
              const span =
                differenceInCalendarDays(
                  startOfDay(task.end),
                  startOfDay(task.start),
                ) + 1
              const left = offset * DAY_WIDTH
              const width = Math.max(span, 1) * DAY_WIDTH

              return (
                <div key={task.id} className={row()}>
                  {days.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={cell()}
                      style={{ width: DAY_WIDTH }}
                    />
                  ))}
                  <div
                    data-gantt-bar=""
                    className={bar({ className: task.color ?? 'bg-primary' })}
                    style={{ left, width }}
                    title={task.name}
                  >
                    <span className={barLabel()}>{task.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// MARK: separator

export type { GanttProps, GanttTask }
export { Gantt }
