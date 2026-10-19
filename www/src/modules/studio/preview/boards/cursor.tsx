"use client"

import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"

import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
} from "../../sections/cursors"
import {
  Board,
  BoardSection,
  Specimen,
  stateProps,
  useRootToken,
} from "./board"

const CURSORS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
}

/** The system cursor the token names, resting on the control. */
function Cursor({ token }: { token: string }) {
  const Glyph = CURSORS[useRootToken(token)] ?? ArrowCursor
  return (
    <span className="pointer-events-none absolute top-1/2 left-[80%] size-6 *:size-full!">
      <Glyph />
    </span>
  )
}

function Cursors() {
  const button = useButtonStyles()
  return (
    <div
      inert
      className="flex flex-wrap items-end justify-center gap-x-12 gap-y-6"
    >
      <Specimen label="Control">
        <span className="relative">
          <span
            {...stateProps("hover")}
            data-button=""
            className={button({ variant: "primary" })}
          >
            Publish
          </span>
          <Cursor token="--cursor-interactive" />
        </span>
      </Specimen>
      <Specimen label="Disabled">
        <span className="relative">
          <Button variant="primary" isDisabled>
            Publish
          </Button>
          <Cursor token="--cursor-disabled" />
        </span>
      </Specimen>
    </div>
  )
}

export default function CursorBoard() {
  return (
    <Board id="cursor">
      <BoardSection title="Cursor">
        <Cursors />
      </BoardSection>
    </Board>
  )
}
