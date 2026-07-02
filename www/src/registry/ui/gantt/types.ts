/**
 * A single task plotted on the Gantt timeline.
 */
export interface GanttTask {
  /**
   * Unique identifier for the task.
   */
  id: string

  /**
   * Display name shown in the sidebar and inside the task bar.
   */
  name: string

  /**
   * Start date of the task (inclusive).
   */
  start: Date

  /**
   * End date of the task (inclusive).
   */
  end: Date

  /**
   * Tailwind background class applied to the task bar.
   * @default 'bg-primary'
   */
  color?: string
}

/**
 * A Gantt chart lays out tasks across a horizontal date axis, with a sidebar of
 * task names beside a scrollable timeline. Each task renders a positioned bar
 * whose offset and width are derived from its start and end dates.
 */
export interface GanttProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /**
   * The tasks to lay out on the timeline.
   */
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
