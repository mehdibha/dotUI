"use client"

/* Share: a popover (a drawer on phones) whose contents follow what is
   current. Opening it does nothing; only its buttons publish or copy. */

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Description, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { TextField } from "@/registry/ui/text-field"
import { getPreset } from "@/modules/presets"
import {
  copyText,
  initCommand,
  publishSystem,
  snapshotLink,
} from "@/modules/studio/publish"
import { useCurrent, viewLink } from "@/modules/studio/selection"
import { clock } from "@/modules/studio/time"
import { usePublishStatus } from "@/modules/studio/workspace"

import { KeepFocus } from "./keep-focus"
import { PublishButton } from "./publish-button"

const COPIED_MS = 2000

const copyKey = () =>
  /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘C" : "Ctrl+C"

/** "Copied" for 2s after a write that succeeded; `failed` after one that
 *  didn't, when the field is selected for a manual copy. */
function useCopied() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  function done(ok: boolean) {
    clearTimeout(timer.current)
    setState(ok ? "copied" : "failed")
    if (ok) timer.current = setTimeout(() => setState("idle"), COPIED_MS)
  }
  return [state, done] as const
}

type CopyState = ReturnType<typeof useCopied>[0]

function CopyField({
  label,
  value,
  outside = "idle",
}: {
  label: string
  value: string
  /** A write of this value made elsewhere (Publish and copy). */
  outside?: CopyState
}) {
  const [own, done] = useCopied()
  const state = own === "idle" ? outside : own
  const input = useRef<HTMLInputElement>(null)
  const failed = state === "failed"

  useEffect(() => {
    if (failed) input.current?.select()
  }, [failed])

  return (
    <TextField value={value} isReadOnly className="w-full">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          ref={input}
          onFocus={(e) => e.target.select()}
          className="min-w-0 flex-1 font-mono text-xs"
        />
        <Button
          size="sm"
          onPress={() =>
            copyText(value).then(
              () => done(true),
              (error: unknown) => {
                console.error(error)
                done(false)
              },
            )
          }
          className="shrink-0"
        >
          {state === "copied" ? "Copied" : "Copy"}
        </Button>
      </div>
      {failed && <Description>Press {copyKey()} to copy.</Description>}
    </TextField>
  )
}

export function SharePopover({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      {children}
      <Popover placement="bottom end" className="w-80">
        <DialogContent aria-label="Share" className="gap-3 p-4">
          <ShareBody />
        </DialogContent>
      </Popover>
    </Dialog>
  )
}

function ShareBody() {
  const { doc, sel, name } = useCurrent()
  const status = usePublishStatus(doc)
  const isMobile = useIsMobile()
  const [state, done] = useCopied()
  const [publishFailed, setPublishFailed] = useState(false)
  const last = doc?.published.at(-1)

  const link = doc
    ? last && snapshotLink(last.id)
    : viewLink(sel as Exclude<typeof sel, { kind: "system" }>)
  const install = doc
    ? last && initCommand(`s/${last.id}`)
    : initCommand(`${sel.kind === "preset" ? "p" : "s"}/${sel.id}`)

  function publishAndCopy() {
    if (!doc) return
    setPublishFailed(false)
    let failed = false
    const published = publishSystem(doc.id).then(
      (id) => {
        if (!id) throw new Error("cancelled")
        return snapshotLink(id)
      },
      (error: unknown) => {
        failed = true
        throw error
      },
    )
    copyText(published).then(
      () => done(true),
      (error: unknown) => {
        if (failed) return setPublishFailed(true)
        if (error instanceof Error && error.message === "cancelled") return
        console.error(error)
        done(false)
      },
    )
  }

  const pending = status === "pending"
  const publishLabel = last ? "Publish and copy" : "Publish and copy link"

  return (
    <>
      <KeepFocus />
      <h2 className="truncate text-sm font-medium" dir="auto">
        Share {name}
      </h2>
      {isMobile && doc && <PublishButton doc={doc} className="w-full" />}
      {link && install ? (
        <>
          <CopyField label="Studio link" value={link} outside={state} />
          <CopyField label="Install" value={install} />
        </>
      ) : (
        <p className="text-xs text-fg-muted">
          Publish to get a link. Links are frozen: later edits need a new
          publish.
        </p>
      )}
      {sel.kind === "preset" && (
        <p className="text-xs text-fg-muted">
          Always shows the latest {getPreset(sel.id)?.name ?? name}.
        </p>
      )}
      {last && status === "current" && (
        <p className="text-xs text-fg-muted">Published {clock(last.at)}</p>
      )}
      {last && (status === "changed" || pending) && (
        <p className="text-xs text-fg-muted">
          This link shows the {clock(last.at)} version. Your newer edits aren't
          in it.
        </p>
      )}
      {publishFailed && (
        <p className="text-xs text-fg-danger">
          Couldn't publish ·{" "}
          <button
            type="button"
            onClick={publishAndCopy}
            className="underline underline-offset-2"
          >
            Try again
          </button>
        </p>
      )}
      {doc && (status === "never" || status === "changed" || pending) && (
        <Button
          variant="primary"
          size="sm"
          isPending={pending}
          onPress={publishAndCopy}
          className="w-full"
        >
          {pending ? "Publishing…" : publishLabel}
        </Button>
      )}
      {isMobile && link && typeof navigator.share === "function" && (
        <Button
          size="sm"
          onPress={() =>
            navigator.share({ title: name, url: link }).catch(() => {})
          }
          className="w-full"
        >
          Share…
        </Button>
      )}
      {window.location.hostname !== "dotui.org" && (
        <p className="text-xs text-fg-muted">
          Links made on {window.location.host} only work there.
        </p>
      )}
    </>
  )
}
