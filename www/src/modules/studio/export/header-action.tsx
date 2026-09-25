import { useState } from "react"
import { LinkIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { toastManager } from "@/registry/ui/toast"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { HeaderActions } from "@/components/layout/header-slot"
import { publishSystem } from "@/modules/studio/keep-dialog"
import { useCurrent, viewLink } from "@/modules/studio/selection"
import type { ViewSelection } from "@/modules/studio/selection"
import { findSystem, useUnpublishedChanges } from "@/modules/studio/workspace"
import type { DesignSystemDoc } from "@/modules/studio/workspace"

import { ExportDialog } from "./export-dialog"

const failed = (title: string) => (error: unknown) => {
  console.error(error)
  toastManager.add({ title, type: "error" })
}

// Safari only lets a clipboard write follow the press if it starts in it.
async function copyLater(text: Promise<string>) {
  if (
    typeof ClipboardItem !== "undefined" &&
    ClipboardItem.supports?.("text/plain")
  )
    return navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })),
      }),
    ])
  return navigator.clipboard.writeText(await text)
}

/** Copies the current design system's studio link, publishing the user's
 *  system first. */
export function share(target: DesignSystemDoc | ViewSelection) {
  const link =
    "kind" in target
      ? Promise.resolve(viewLink(target))
      : publishSystem(target).then((snapshot) => {
          if (!snapshot) throw new Error("cancelled")
          return `${window.location.origin}/studio?s=${snapshot}`
        })
  copyLater(link).then(
    () => toastManager.add({ title: "Link copied" }),
    (error: unknown) => {
      if (error instanceof Error && error.message === "cancelled") return
      failed("Couldn't share")(error)
    },
  )
}

/**
 * The studio's header actions — Share, Publish, Export — portaled into the
 * global header so they stay visible from both mobile panes. Views have
 * nothing to publish.
 */
export function StudioHeaderActions() {
  const { doc, sel } = useCurrent()
  const unpublished = useUnpublishedChanges(doc)
  const [publishing, setPublishing] = useState(false)

  function onPublish() {
    if (!doc) return
    setPublishing(true)
    publishSystem(doc)
      .then(
        (snapshot) =>
          snapshot &&
          toastManager.add({
            title: `Published "${findSystem(doc.id)?.name ?? doc.name}"`,
          }),
        failed("Couldn't publish"),
      )
      .finally(() => setPublishing(false))
  }

  return (
    <HeaderActions>
      <Tooltip delay={0}>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Copy share link"
          onPress={() => share(doc ?? (sel as ViewSelection))}
          className="max-sm:hidden"
        >
          <LinkIcon />
        </Button>
        <TooltipContent>Copy share link</TooltipContent>
      </Tooltip>
      {doc && (
        <Button
          variant="secondary"
          size="sm"
          isPending={publishing}
          onPress={onPublish}
          className="gap-1.5"
        >
          Publish
          {unpublished && (
            <span
              role="img"
              aria-label="Unpublished changes"
              className="size-1.5 shrink-0 rounded-full bg-accent"
            />
          )}
        </Button>
      )}
      <ExportDialog>
        <Button variant="primary" size="sm">
          Export
        </Button>
      </ExportDialog>
    </HeaderActions>
  )
}
