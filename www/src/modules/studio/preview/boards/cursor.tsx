"use client"

import { CheckIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import {
  ArrowCursor,
  GrabbingCursor,
  GrabCursor,
  HandCursor,
  NotAllowedCursor,
  ProgressCursor,
  WaitCursor,
} from "../../sections/cursors"
import { Board, stateProps, useBoardFocus, useRootToken } from "./board"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const GLYPHS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
  progress: ProgressCursor,
  wait: WaitCursor,
  grab: GrabCursor,
  grabbing: GrabbingCursor,
}

type Row = { hovered: boolean }

const CONTROL = "--cursor-interactive"
const DISABLED = "--cursor-disabled"
const BUSY = "--cursor-pending"
const DRAG = "--cursor-drag"

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
      <Hover hovered={hovered} token={BUSY}>
        <Button variant="secondary" isPending>
          Save
        </Button>
      </Hover>
    </>
  )
}

function SelectionControls({ hovered }: Row) {
  const checkbox = useCheckboxStyles()()
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
        <span {...state} className={toggle.control()}>
          <span {...state} className={toggle.indicator()}>
            <span {...state} className={toggle.thumb()} />
          </span>
        </span>
      </Hover>
      <Hover hovered={hovered} token={DRAG}>
        <Slider aria-label="Volume" defaultValue={70} className="w-32">
          <SliderControl />
        </Slider>
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
  const editing = (...names: string[]) =>
    names.some((name) => keys.includes(name))
  const controls = editing("cursorControls")
  const rows = (Set: React.ComponentType<Row>) =>
    [false, true].map((hovered) => (
      <Set key={String(hovered)} hovered={hovered} />
    ))
  return (
    <Board id="cursor" untitled className={CANVAS}>
      <SetGrid>
        <ComponentSet
          name="Buttons"
          selected={editing("cursorControls", "cursorBusy")}
          rows={rows(Buttons)}
        />
        <ComponentSet
          name="Selection"
          selected={editing("cursorControls", "cursorDrag")}
          rows={rows(SelectionControls)}
        />
        <ComponentSet
          name="Navigation"
          selected={controls}
          rows={rows(Navigation)}
        />
        <ComponentSet
          name="Disabled"
          selected={editing("cursorDisabled")}
          rows={rows(Disabled)}
        />
      </SetGrid>
    </Board>
  )
}
