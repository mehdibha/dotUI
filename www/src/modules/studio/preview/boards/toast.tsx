"use client"

import { useEffect, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Loader } from "@/registry/ui/loader"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"
import { useStyles as useToastStyles } from "@/registry/ui/toast/styles"

import { Board, BoardSection, useReplay } from "./board"

type ToastType = "neutral" | "success" | "info" | "warning" | "danger"

const ICONS = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  danger: CircleAlertIcon,
  loading: Loader,
} as const

const TOASTS: {
  type: ToastType | "loading"
  title: string
  text?: string
  action?: string
}[] = [
  {
    type: "neutral",
    title: "Conversation archived",
    text: "You can find it in Archive.",
    action: "Undo",
  },
  {
    type: "success",
    title: "Changes saved",
    text: "Your profile is up to date.",
  },
  {
    type: "info",
    title: "New comment",
    text: "Maya replied to your review.",
    action: "View",
  },
  { type: "warning", title: "Storage almost full", text: "9.2 of 10 GB used." },
  {
    type: "danger",
    title: "Upload failed",
    text: "logo.svg is over 5 MB.",
    action: "Retry",
  },
  {
    type: "loading",
    title: "Publishing site",
    text: "This can take a minute.",
  },
]

/** The toast's own slots, in place instead of in its portaled stack. */
function StaticToast({ type, title, text, action }: (typeof TOASTS)[number]) {
  const styles = useToastStyles()()
  const { surface, status } = useComponentParams("toast")
  const Icon = type === "neutral" ? null : ICONS[type]
  // Mirrors the toast's own pick: a solid status fill, else the inverse surface.
  const solid = status === "bold" ? true : status === "soft" ? false : undefined
  const onFill =
    (type === "neutral" || type === "loading" ? undefined : solid) ??
    surface === "inverse"
  return (
    <div
      data-toast=""
      className={styles.toast({
        variant: type,
        className: "relative h-auto w-full max-w-96",
      })}
    >
      <div className={styles.content()}>
        <div className={styles.body()}>
          {Icon && (
            <div className={styles.icon({ variant: type })}>
              <Icon aria-hidden />
            </div>
          )}
          <div className={styles.message()}>
            <div className={styles.title({ variant: type })}>{title}</div>
            {text && (
              <div className={styles.description({ variant: type })}>
                {text}
              </div>
            )}
          </div>
        </div>
        {action && (
          <div className={styles.actions()}>
            <Button
              size="sm"
              variant={onFill ? "quiet" : "secondary"}
              className={styles.action({ onFill })}
            >
              {action}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const LIVE = [
  { title: "Changes saved", type: "success" },
  { title: "Invite sent", description: "maya@acme.com can now join Acme." },
  { title: "Upload failed", type: "danger" },
] as const

const EVERY_MS = 1600
const SHOWN_MS = 4000

/** A resting stack; toasts arrive and leave on a loop while Motion is edited. */
function Replay() {
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const { running, replay } = useReplay("toastMotion")
  const [manager] = useState(() => ToastPrimitive.createToastManager())

  useEffect(() => {
    if (!stage) return
    if (!running) {
      for (const toast of LIVE) manager.add({ ...toast, timeout: 0 })
      return () => manager.close()
    }
    let index = 0
    const closers = new Set<ReturnType<typeof setTimeout>>()
    // Its own dismissal: Base UI pauses timeouts while the iframe is blurred.
    const add = () => {
      const id = manager.add({ ...LIVE[index++ % LIVE.length], timeout: 0 })
      const closer = setTimeout(() => {
        manager.close(id)
        closers.delete(closer)
      }, SHOWN_MS)
      closers.add(closer)
    }
    add()
    const timer = setInterval(add, EVERY_MS)
    return () => {
      clearInterval(timer)
      for (const closer of closers) clearTimeout(closer)
      manager.close()
    }
  }, [stage, running, replay, manager])

  return (
    <div
      ref={setStage}
      // Transformed, so the fixed toast viewport anchors to this stage.
      className="absolute inset-0 transform-gpu **:data-toast-viewport:w-[calc(100%-2*var(--toast-inset))]"
    >
      {stage && (
        <ToastProvider
          toastManager={manager}
          position="bottom-center"
          portalProps={{ container: stage }}
        />
      )}
    </div>
  )
}

export default function ToastBoard() {
  return (
    <Board id="toast">
      <BoardSection title="Variants" className="block">
        <div
          inert
          className="grid w-full items-start justify-items-center gap-3 md:grid-cols-2"
        >
          {TOASTS.map((toast) => (
            <StaticToast key={toast.type} {...toast} />
          ))}
        </div>
      </BoardSection>
      <BoardSection
        title="Motion"
        className="relative h-56 overflow-hidden p-0 max-sm:p-0"
      >
        <Replay />
      </BoardSection>
    </Board>
  )
}
