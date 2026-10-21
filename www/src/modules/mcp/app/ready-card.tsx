import { useMemo, useRef, useState } from "react"

import { CheckIcon, CopyIcon } from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { salvageState } from "@/modules/studio/axes"
import { OPTIONS } from "@/modules/studio/axes/meta"

import type { MintedDesignSystem } from "../design"
import { CardActions, Themed, useCard, useSystem } from "./shell"
import { Specimen } from "./specimen"

export interface ReadyPayload extends MintedDesignSystem {
  card: "ready"
}

type Manager = keyof MintedDesignSystem["commands"]

const label = (key: string, value: unknown) =>
  OPTIONS[key]?.find((o) => o.value === value)?.label ?? String(value)

export function ReadyCard({
  id,
  name,
  diff,
  studioUrl,
  v0Url,
  commands,
}: ReadyPayload) {
  const { app } = useCard()
  const system = useSystem(diff)
  const [manager, setManager] = useState<Manager>("npm")
  const [copied, setCopied] = useState(false)
  const code = useRef<HTMLElement>(null)
  const facts = useMemo(() => {
    const state = salvageState(diff)
    const heading =
      state.headingFont === "same" ? state.bodyFont : state.headingFont
    return [
      heading === state.bodyFont
        ? String(state.bodyFont)
        : `${heading} + ${state.bodyFont}`,
      `${label("iconLibrary", state.iconLibrary)} icons`,
      `${label("density", state.density)} density`,
      "Light and dark",
    ]
  }, [diff])

  async function copy() {
    try {
      await navigator.clipboard.writeText(commands[manager])
      setCopied(true)
    } catch {
      // No clipboard in this host: select it for ⌘C instead.
      if (code.current) getSelection()?.selectAllChildren(code.current)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[13rem_1fr]">
      <Themed system={system}>
        <Specimen product={name} />
      </Themed>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-medium">{name} is ready</p>
          <p className="text-xs text-fg-muted">
            Saved as {id}. Ask Claude to set up your project or build a first
            screen.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {facts.map((fact) => (
            <Badge key={fact} variant="neutral">
              {fact}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <SegmentedControl
            aria-label="Package manager"
            selectedKeys={[manager]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next === "npm" || next === "pnpm" || next === "bun") {
                setManager(next)
                setCopied(false)
              }
            }}
          >
            <SegmentedControlItem id="npm">npm</SegmentedControlItem>
            <SegmentedControlItem id="pnpm">pnpm</SegmentedControlItem>
            <SegmentedControlItem id="bun">bun</SegmentedControlItem>
          </SegmentedControl>
          <div className="flex items-center gap-2 rounded-md border bg-card p-1.5 pl-2.5">
            <code
              ref={code}
              className="min-w-0 flex-1 truncate font-mono text-xs"
            >
              {commands[manager]}
            </code>
            <Button
              isIconOnly
              size="sm"
              variant="quiet"
              aria-label={copied ? "Copied" : "Copy the install command"}
              onPress={copy}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
        <CardActions>
          <Button onPress={() => app.openLink({ url: v0Url })}>
            Open in v0
          </Button>
          <Button
            variant="primary"
            onPress={() => app.openLink({ url: studioUrl })}
          >
            Open in studio
          </Button>
        </CardActions>
      </div>
    </div>
  )
}
