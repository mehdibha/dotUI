import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"

import { OverlayPreview } from "../overlay"

const PEOPLE = [
  { id: "amandarivera", name: "Amanda Rivera" },
  { id: "adamscott", name: "Adam Scott" },
  { id: "ariachen", name: "Aria Chen" },
]

// The editor and suggestion rows use the real token classes (field, popover,
// highlighted item) so the scene restyles under any preset.
export function MentionDemo() {
  return (
    <OverlayPreview
      variant="menu"
      surfaceClassName="w-full max-w-[17rem]"
      trigger={
        <div className="w-full max-w-[17rem] rounded-(--input-radius) border border-border-focus bg-field px-3 py-2.5 text-sm/relaxed text-fg ring-2 ring-border-focus-muted">
          Great work{" "}
          <span className="rounded-sm bg-muted px-1 font-medium">
            @alexmiller
          </span>{" "}
          and @a
        </div>
      }
    >
      {PEOPLE.map((person, i) => (
        <div
          key={person.id}
          className={cn(
            "flex items-center gap-2 rounded-sm px-2 py-1.5",
            i === 0 && "bg-highlight text-fg-on-highlight",
          )}
        >
          <Avatar size="sm">
            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[0.8rem] font-medium">
              {person.name}
            </span>
            <span
              className={cn(
                "truncate text-xs",
                i === 0 ? "text-fg-on-highlight/70" : "text-fg-muted",
              )}
            >
              @{person.id}
            </span>
          </div>
        </div>
      ))}
    </OverlayPreview>
  )
}
