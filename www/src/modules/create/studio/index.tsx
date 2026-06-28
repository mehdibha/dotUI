import { CustomizePanel } from './customize-panel'
import { StudioHeader } from './header'
import { Stage } from './stage'

/**
 * The consolidated /create builder shell.
 *
 * A focused, full-viewport workspace: its own app-shell header sits above two
 * panels — the customize panel (controls) and the stage (live preview). Both
 * panels are intentionally empty for now; they're filled in step by step.
 */
export function Studio() {
  return (
    <div className="flex h-svh flex-col bg-muted">
      <StudioHeader />
      {/* Below `lg` the two panels can't sit side by side, so they stack. The
          responsive pane switcher lands when the real panels do. */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-6">
        <CustomizePanel className="max-lg:h-72 lg:w-[22rem]" />
        <Stage />
      </div>
    </div>
  )
}
