import { useState } from "react"
import { LinkIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { toastManager } from "@/registry/ui/toast"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { HeaderActions } from "@/components/layout/header-slot"
import {
  isUntouched,
  publish,
  useOpenSystem,
  useUnpublishedChanges,
} from "@/modules/studio/workspace"

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

/** Publishes the system and copies its studio link. */
export function share(id: string) {
  const link = publish(id).then(
    (snapshot) => `${window.location.origin}/studio?s=${snapshot}`,
  )
  copyLater(link).then(
    () => toastManager.add({ title: "Link copied" }),
    failed("Couldn't share"),
  )
}

/**
 * The studio's header actions — Share, Publish, Export — portaled into the
 * global header so they stay visible from both mobile panes.
 */
export function StudioHeaderActions() {
  const doc = useOpenSystem()
  // A preset nobody has touched yet has nothing of its own to publish.
  const unpublished =
    useUnpublishedChanges(doc) &&
    (doc.published.length > 0 || !isUntouched(doc))
  const [publishing, setPublishing] = useState(false)

  function onPublish() {
    setPublishing(true)
    publish(doc.id)
      .then(
        () => toastManager.add({ title: `Published ${doc.name}` }),
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
          onPress={() => share(doc.id)}
          className="max-sm:hidden"
        >
          <LinkIcon />
        </Button>
        <TooltipContent>Copy share link</TooltipContent>
      </Tooltip>
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
      <ExportDialog>
        <Button variant="primary" size="sm">
          Export
        </Button>
      </ExportDialog>
    </HeaderActions>
  )
}
