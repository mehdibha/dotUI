"use client"

/* Share: a popover with the link to what's on screen, previewed in its own
   design system. Unsaved edits can be shared, or the version they edit. */

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { CheckIcon, LinkIcon } from "lucide-react"

import { DesignSystemProvider } from "@/lib/styles"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { FieldGroup, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import { Switch } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"
import type { StudioState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"
import { describe, useCurrent } from "@/modules/studio/selection"
import { studioLink, useSource } from "@/modules/studio/share"
import { useWorkspace } from "@/modules/studio/workspace"

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
  const workspace = useWorkspace()
  const [version, setVersion] = useState<"edited" | "saved">("edited")
  const shared =
    version === "saved" && current.unsaved
      ? describe(current.unsaved.from, workspace)
      : current
  const name = shared.content?.name ?? shared.name
  const { source, failed, retry } = useSource(shared)
  const isMobile = useIsMobile()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const link = source && studioLink(source)

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Share design system</h2>
        <p className="text-xs text-fg-muted">
          Anyone with the link can open it in the studio, then save, edit or
          install it.
        </p>
      </div>
      {current.unsaved && (
        <RadioGroup
          aria-label="Version"
          value={version}
          onChange={(value) => setVersion(value as "edited" | "saved")}
        >
          <FieldGroup className="grid grid-cols-2 gap-2">
            <Radio value="edited">
              <RadioControl>
                <RadioIndicator />
                <Label>Edited</Label>
              </RadioControl>
            </Radio>
            <Radio value="saved">
              <RadioControl>
                <RadioIndicator />
                <Label>Saved</Label>
              </RadioControl>
            </Radio>
          </FieldGroup>
        </RadioGroup>
      )}
      <SharedPreview name={name} state={shared.state} />
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
            {isCopied ? <CheckIcon /> : <LinkIcon />}
            {isCopied ? "Copied" : "Copy link"}
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

/** What the link opens, drawn in its own design system. */
function SharedPreview({ name, state }: { name: string; state: StudioState }) {
  const designSystem = useMemo(() => designSystemOf(state), [state])
  return (
    <DesignSystemProvider
      scoped
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      <div
        aria-hidden
        inert
        className="flex flex-col gap-3 rounded-lg border bg-bg p-3 select-none"
      >
        <p
          dir="auto"
          className="truncate font-heading text-sm font-semibold text-fg"
        >
          {name}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Get started
          </Button>
          <Button size="sm">Learn more</Button>
        </div>
        <div className="flex items-center gap-3">
          <Switch aria-label="Switch" defaultSelected />
          <Checkbox aria-label="Checkbox" defaultSelected />
          <Badge>New</Badge>
        </div>
      </div>
    </DesignSystemProvider>
  )
}
