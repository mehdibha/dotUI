"use client"

/* Share: a popover (a drawer on phones) with the link to what's on screen. */

import type { ReactNode } from "react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Button } from "@/registry/ui/button"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Input } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { TextField } from "@/registry/ui/text-field"
import { useCurrent } from "@/modules/studio/selection"
import { studioLink, useSource } from "@/modules/studio/share"

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
  const current = useCurrent()
  const name = current.content?.name ?? current.name
  const { source, failed, retry } = useSource()
  const isMobile = useIsMobile()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const link = source && studioLink(source)

  return (
    <>
      <h2 className="truncate text-sm font-medium" dir="auto">
        Share {name}
      </h2>
      <TextField
        value={link ?? ""}
        isReadOnly
        aria-label="Link"
        className="w-full"
      >
        <div className="flex gap-2">
          <Input
            onFocus={(e) => e.target.select()}
            placeholder={failed ? undefined : "Creating link…"}
            size="sm"
            className="min-w-0 flex-1 font-mono sm:text-xs"
          />
          <Button
            size="sm"
            isDisabled={!link}
            onPress={() => link && copyToClipboard(link)}
            className="shrink-0"
          >
            {isCopied ? "Copied" : "Copy"}
          </Button>
        </div>
      </TextField>
      {failed && (
        <p className="text-xs text-fg-danger">
          Couldn't create the link ·{" "}
          <button
            type="button"
            onClick={retry}
            className="underline underline-offset-2"
          >
            Try again
          </button>
        </p>
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
    </>
  )
}
