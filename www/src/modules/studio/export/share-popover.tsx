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

/** Whether a write succeeded in the last 2s. */
function useCopied() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  function done(ok: boolean) {
    clearTimeout(timer.current)
    setCopied(ok)
    if (ok) timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }
  return [copied, done] as const
}

function select(input: HTMLInputElement | null) {
  input?.focus()
  input?.select()
}

function CopyField({
  label,
  value,
  copiedOutside = false,
  failed,
  onFailedChange,
}: {
  label: string
  value: string
  /** A write of this value made elsewhere (Publish and copy) succeeded. */
  copiedOutside?: boolean
  /** Its write failed: it is selected for ⌘C, with a hint. */
  failed: boolean
  onFailedChange: (failed: boolean) => void
}) {
  const [own, done] = useCopied()
  const copied = own || copiedOutside
  const input = useRef<HTMLInputElement>(null)

  // Selected for ⌘C once a write fails; a failed press here selects it
  // again, as the press moved focus to the button.
  useEffect(() => {
    if (failed) select(input.current)
  }, [failed])

  // The end tells versions apart (`?s=<id>`), so that's the part in view;
  // "Copied" narrows the field too.
  useEffect(() => {
    if (input.current) input.current.scrollLeft = input.current.scrollWidth
  }, [value, copied])

  return (
    <TextField value={value} isReadOnly className="w-full">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          ref={input}
          onFocus={(e) => e.target.select()}
          size="sm"
          className="min-w-0 flex-1 font-mono sm:text-xs"
        />
        <Button
          size="sm"
          onPress={() => {
            onFailedChange(false)
            copyText(value).then(
              () => done(true),
              (error: unknown) => {
                console.error(error)
                done(false)
                onFailedChange(true)
                select(input.current)
              },
            )
          }}
          className="shrink-0"
        >
          {copied ? "Copied" : "Copy"}
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
  const [copied, done] = useCopied()
  // The one field whose write failed, hinting ⌘C.
  const [failed, setFailed] = useState<string>()
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
    setFailed(undefined)
    let publishError = false
    const published = publishSystem(doc.id).then(
      (id) => {
        if (!id) throw new Error("cancelled")
        return snapshotLink(id)
      },
      (error: unknown) => {
        publishError = true
        throw error
      },
    )
    copyText(published).then(
      () => done(true),
      (error: unknown) => {
        if (publishError) return setPublishFailed(true)
        if (error instanceof Error && error.message === "cancelled") return
        console.error(error)
        done(false)
        setFailed("link")
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
      {isMobile && doc && (
        <PublishButton doc={doc} className="w-full pointer-coarse:h-11" />
      )}
      {link && install ? (
        <>
          <CopyField
            label="Studio link"
            value={link}
            copiedOutside={copied}
            failed={failed === "link"}
            onFailedChange={(f) => setFailed(f ? "link" : undefined)}
          />
          <CopyField
            label="Install"
            value={install}
            failed={failed === "install"}
            onFailedChange={(f) => setFailed(f ? "install" : undefined)}
          />
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
          isDisabled={pending}
          onPress={publishAndCopy}
          className="w-full pointer-coarse:h-11"
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
          className="w-full pointer-coarse:h-11"
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
