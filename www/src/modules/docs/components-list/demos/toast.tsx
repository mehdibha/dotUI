import { CircleCheckIcon } from "@/registry/__generated__/icons"

// A presentational stand-in: the real toast is triggered and portaled at
// runtime, which doesn't preview in a static grid. The surface mirrors it.
export function ToastDemo() {
  return (
    <div className="flex w-64 items-center gap-3 rounded-lg border bg-card p-3 text-fg shadow-lg">
      <CircleCheckIcon className="size-5 shrink-0 text-fg-success" />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-fg">
          Event has been created
        </span>
        <span className="truncate text-xs text-fg-muted">
          Sunday at 9:00 AM
        </span>
      </div>
    </div>
  )
}
