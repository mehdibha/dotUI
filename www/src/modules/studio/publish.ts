"use client"

/* Publishing from any entry point — the Publish button, Share, Export —
   goes through `publishSystem`: a draft is named first, one request runs
   per system, and one toast per system reports it. */

import { toastManager } from "@/registry/ui/toast"
import { codeFlags } from "@/publisher/code-options"
import {
  buildInitCommands,
  packageManagerStore,
} from "@/modules/docs/install-commands"

import { getCodeOptions } from "./export/code-options-store"
import { quoted } from "./history-menu"
import { nameDraft } from "./keep-dialog"
import * as workspace from "./workspace"

/** The studio link of a published version. */
export const snapshotLink = (id: string) =>
  `${window.location.origin}/studio?s=${id}`

/** The init command for a registry path: `p/<preset>` or `s/<snapshot>`. */
export function initCommand(path: string): string {
  const flags = codeFlags(getCodeOptions())
  const url = `${window.location.origin}/r/${path}/init.json${flags ? `?code=${flags}` : ""}`
  return buildInitCommands(url)[packageManagerStore.get()]
}

/** Writes to the clipboard; the text may still be on its way (a publish),
 *  as Safari only allows a write that starts in the press. */
export async function copyText(text: string | Promise<string>) {
  if (
    typeof text !== "string" &&
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

/** Publishes the system, naming a draft first. Resolves the snapshot id,
 *  or undefined when the user cancels; a failure toasts (with Retry) and
 *  rejects. */
export function publishSystem(id: string): Promise<string | undefined> {
  const running = workspace.publishing(id)
  if (running) return running
  const doc = workspace.findSystem(id)
  if (!doc) return Promise.resolve(undefined)
  if (doc.draft)
    return nameDraft(doc).then((kept) => (kept ? publishSystem(id) : undefined))

  const toastId = `publish:${id}`
  const name = () => quoted(workspace.findSystem(id)?.name ?? doc.name)
  return workspace.publish(id).then(
    async (snapshot) => {
      const now = workspace.findSystem(id)
      const edited = now && (await workspace.hasUnpublishedChanges(now))
      toastManager.add({
        id: toastId,
        title: `Published ${name()}`,
        description: edited
          ? "Edits made while publishing aren't included."
          : undefined,
        type: "success",
        actionProps: {
          children: "Copy link",
          onClick: () => {
            toastManager.close(toastId)
            copyText(snapshotLink(snapshot)).catch(console.error)
          },
        },
      })
      return snapshot
    },
    (error: unknown) => {
      console.error(error)
      toastManager.add({
        id: toastId,
        title: `Couldn't publish ${name()}`,
        description: navigator.onLine
          ? "Server error. Try again."
          : "You're offline.",
        type: "error",
        actionProps: {
          children: "Retry",
          onClick: () => {
            toastManager.close(toastId)
            publishSystem(id).catch(() => {})
          },
        },
      })
      throw error
    },
  )
}
