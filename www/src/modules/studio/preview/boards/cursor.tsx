"use client"

import { CheckIcon, PlusIcon } from "@/registry/icons"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useRadioStyles } from "@/registry/ui/radio-group/styles"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
} from "../../sections/cursors"
import { Board, stateProps, useBoardFocus, useRootToken } from "./board"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const GLYPHS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
}

type Row = { hovered: boolean }

const CONTROL = "--cursor-interactive"
const DISABLED = "--cursor-disabled"

/** A specimen with, when hovered, the system cursor `token` names resting
 *  on it; with no token (links), the hand. */
function Hover({
  hovered,
  token,
  children,
}: {
  hovered: boolean
  token?: string
  children: React.ReactNode
}) {
  const value = useRootToken(token ?? CONTROL)
  const Glyph = token ? (GLYPHS[value] ?? ArrowCursor) : HandCursor
  return (
    <span className="relative inline-flex">
      {children}
      {hovered && (
        <span className="pointer-events-none absolute top-1/2 left-[70%] z-10 size-6 *:size-full!">
          <Glyph />
        </span>
      )}
    </span>
  )
}

function Buttons({ hovered }: Row) {
  const button = useButtonStyles()
  const state = hovered ? stateProps("hover") : {}
  return (
    <>
      <Hover hovered={hovered} token={CONTROL}>
        <span {...state} className={button({ variant: "primary" })}>
          Publish
        </span>
      </Hover>
      <Hover hovered={hovered} token={CONTROL}>
        <span {...state} className={button({ variant: "secondary" })}>
          Preview
        </span>
      </Hover>
      <Hover hovered={hovered} token={CONTROL}>
        <span
          {...state}
          data-icon-only=""
          aria-label="Add"
          className={button({ variant: "secondary" })}
        >
          <PlusIcon />
        </span>
      </Hover>
    </>
  )
}

function SelectionControls({ hovered }: Row) {
  const checkbox = useCheckboxStyles()()
  const radio = useRadioStyles()()
  const toggle = useSwitchStyles()()
  const state = { ...(hovered && stateProps("hover")), "data-selected": "true" }
  return (
    <>
      <Hover hovered={hovered} token={CONTROL}>
        <span className={checkbox.root()}>
          <span {...state} className={checkbox.control()}>
            <span {...state} className={checkbox.indicator()}>
              <CheckIcon />
            </span>
          </span>
          <Label elementType="span">Remember me</Label>
        </span>
      </Hover>
      <Hover hovered={hovered} token={CONTROL}>
        <span data-radio="" className={radio.root()}>
          <span {...state} className={radio.control()}>
            <span {...state} className={radio.indicator()}>
              <span />
            </span>
          </span>
          <Label elementType="span">Monthly</Label>
        </span>
      </Hover>
      <Hover hovered={hovered} token={CONTROL}>
        <span {...state} className={toggle.control()}>
          <span {...state} className={toggle.indicator()}>
            <span {...state} className={toggle.thumb()} />
          </span>
        </span>
      </Hover>
    </>
  )
}

const TABS = ["Overview", "Activity", "Settings"]
const HORIZONTAL = { "data-rac": "", "data-orientation": "horizontal" }

function Tabs({ hovered }: Row) {
  const tabs = useTabsStyles()()
  return (
    <div className={tabs.root({ orientation: "horizontal" })}>
      <div {...HORIZONTAL} className={tabs.list({ orientation: "horizontal" })}>
        {TABS.map((name, index) => {
          const tab = (
            <div
              key={name}
              {...HORIZONTAL}
              {...(index === 0 && { "data-selected": "true" })}
              // The second tab is the one under the pointer.
              {...(index === 1 && hovered && stateProps("hover"))}
              className={tabs.item({ orientation: "horizontal" })}
            >
              {index === 0 && (
                <span
                  {...HORIZONTAL}
                  className={tabs.indicator({ orientation: "horizontal" })}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-[inherit]">
                {name}
              </span>
            </div>
          )
          return index === 1 ? (
            <Hover key={name} hovered={hovered} token={CONTROL}>
              {tab}
            </Hover>
          ) : (
            tab
          )
        })}
      </div>
    </div>
  )
}

function Navigation({ hovered }: Row) {
  const link = useLinkStyles()
  return (
    <>
      <Tabs hovered={hovered} />
      <Hover hovered={hovered}>
        <span {...(hovered && stateProps("hover"))} className={link({})}>
          View invoice
        </span>
      </Hover>
    </>
  )
}

function Disabled({ hovered }: Row) {
  const button = useButtonStyles()
  const checkbox = useCheckboxStyles()()
  const toggle = useSwitchStyles()()
  const state = stateProps("disabled")
  return (
    <>
      <Hover hovered={hovered} token={DISABLED}>
        <span {...state} className={button({ variant: "primary" })}>
          Publish
        </span>
      </Hover>
      <Hover hovered={hovered} token={DISABLED}>
        <span className={checkbox.root()}>
          <span {...state} className={checkbox.control()}>
            <span {...state} className={checkbox.indicator()} />
          </span>
          <Label elementType="span" {...state}>
            Remember me
          </Label>
        </span>
      </Hover>
      <Hover hovered={hovered} token={DISABLED}>
        <span {...state} className={toggle.control()}>
          <span {...state} className={toggle.indicator()}>
            <span {...state} className={toggle.thumb()} />
          </span>
        </span>
      </Hover>
    </>
  )
}

export default function CursorBoard() {
  const { axis, holds } = useBoardFocus()
  const keys = [axis, ...(holds ?? [])]
  const controls = keys.includes("cursorControls")
  const disabled = keys.includes("cursorDisabled")
  const rows = (Set: React.ComponentType<Row>) =>
    [false, true].map((hovered) => (
      <Set key={String(hovered)} hovered={hovered} />
    ))
  return (
    <Board id="cursor" untitled className={CANVAS}>
      <SetGrid>
        <ComponentSet name="Buttons" selected={controls} rows={rows(Buttons)} />
        <ComponentSet
          name="Selection"
          selected={controls}
          rows={rows(SelectionControls)}
        />
        <ComponentSet
          name="Navigation"
          selected={controls}
          rows={rows(Navigation)}
        />
        <ComponentSet
          name="Disabled"
          selected={disabled}
          rows={rows(Disabled)}
        />
      </SetGrid>
    </Board>
  )
}
