import { useState } from "react"

import { ArchiveIcon, InboxIcon } from "@/registry/icons"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"

// Its own manager: other toast providers on the site must not render these.
const toastManager = ToastPrimitive.createToastManager()

export function ToastScene() {
  const [archived, setArchived] = useState(false)

  const archive = () => {
    setArchived(true)
    const id = toastManager.add({
      title: "Conversation archived",
      description: "Swipe down to dismiss.",
      actionProps: {
        children: "Undo",
        onClick: () => {
          setArchived(false)
          toastManager.close(id)
        },
      },
    })
  }

  return (
    <>
      {archived ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <InboxIcon className="size-6 text-fg-muted" />
          <p className="text-sm text-fg-muted">Inbox zero.</p>
          <Button size="sm" onPress={() => setArchived(false)}>
            Bring it back
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
          <Avatar size="sm">
            <AvatarFallback>NK</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Nadia Karim</p>
            <p className="truncate text-xs text-fg-muted">
              Final mobile mocks are in Figma
            </p>
          </div>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Archive"
            onPress={archive}
          >
            <ArchiveIcon />
          </Button>
        </div>
      )}
      <ToastProvider toastManager={toastManager} position="bottom-center" />
    </>
  )
}
