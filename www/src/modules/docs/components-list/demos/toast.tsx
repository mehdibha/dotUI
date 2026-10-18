import { CircleCheckIcon } from "@/registry/__generated__/icons"
import { useStyles as useToastStyles } from "@/registry/ui/toast/styles"

// The real toast is triggered and portaled at runtime, so the card renders its
// slots statically, with a second toast peeking behind as the stack collapses.
export function ToastDemo() {
  const { toast, content, body, icon, message, title, description } =
    useToastStyles()()
  return (
    <div className="relative w-64">
      <div
        aria-hidden
        className={toast({ className: "inset-x-3 -top-2 h-8 w-auto" })}
      />
      <div className={toast({ variant: "success", className: "relative" })}>
        <div className={content()}>
          <div className={body()}>
            <div className={icon({ variant: "success" })}>
              <CircleCheckIcon aria-hidden />
            </div>
            <div className={message()}>
              <span className={title({ variant: "success" })}>
                Event has been created
              </span>
              <span className={description({ variant: "success" })}>
                Sunday at 9:00 AM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
