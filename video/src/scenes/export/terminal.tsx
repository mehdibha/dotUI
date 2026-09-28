import type { CSSProperties, ReactNode } from "react"

import { ease, progress } from "../../lib/motion"
import { Window } from "./chrome"
import {
  ADD_KEYS,
  ADD_ROW,
  ADD_TYPED,
  C,
  CH,
  FLY_AT,
  IDLE_AT,
  IDLE_ROW,
  INIT_KEYS,
  INIT_PASTED,
  INIT_ROWS,
  INIT_TYPED,
  MONO,
  OUTPUT,
  PROMPT,
  PROMPT_COLS,
  T,
  TERM,
  TERM_H,
  TERM_W,
} from "./data"
import type { OutLine } from "./data"
import { terminalScroll } from "./layout"

/* A zsh session: init with the pasted preset URL, then add. Long lines wrap
   at the window's width like a real terminal; marks are drawn, not glyphs. */

type Run = { text: string; color?: string; bg?: string; chevron?: boolean }

export function Terminal({ frame }: { frame: number }) {
  const scroll = terminalScroll(frame)
  const initTyped = INIT_KEYS.filter((k) => frame >= k).length
  const pasted = frame >= T.paste
  const initLen = PROMPT_COLS + initTyped + (pasted ? INIT_PASTED.length : 0)
  const initLast = pasted ? T.paste : (INIT_KEYS[initTyped - 1] ?? T.typeFrom)
  const highlight = 0.3 * (1 - progress(frame, T.paste + 4, 30, ease.soft))

  const addTyped = ADD_KEYS.filter((k) => frame >= k).length
  const addShown = frame >= OUTPUT.find((l) => l.kind === "command")!.at
  const addLast = ADD_KEYS[addTyped - 1] ?? ADD_KEYS[0]! - 3

  const blink = (since: number) => (frame - since) % 60 < 34

  return (
    <Window
      width={TERM_W}
      height={TERM_H}
      bar={TERM.bar}
      titleSize={16}
      title={`my-app — zsh — ${TERM.cols}×${TERM.rows}`}
    >
      <div
        style={{
          position: "absolute",
          left: TERM.padX,
          right: TERM.padX,
          top: TERM.bar + TERM.padY,
          height: TERM.rows * TERM.line,
          overflow: "hidden",
          fontFamily: MONO,
          fontSize: TERM.font,
          lineHeight: `${TERM.line}px`,
          color: C.fg,
          whiteSpace: "pre",
        }}
      >
        {wrap(
          command(INIT_TYPED.slice(0, initTyped), {
            text: pasted ? INIT_PASTED : "",
            color: C.string,
            bg: `rgba(121,184,255,${highlight.toFixed(3)})`,
          }),
        ).map((runs, r) => (
          <Row key={`init-${r}`} row={r} scroll={scroll}>
            <Runs runs={runs} />
          </Row>
        ))}
        {frame < T.enter && blink(initLast) ? (
          <Caret
            row={Math.floor(initLen / TERM.cols)}
            col={initLen % TERM.cols}
            scroll={scroll}
          />
        ) : null}

        {OUTPUT.map((line, i) =>
          frame >= line.at && line.kind !== "command" ? (
            <Row key={i} row={INIT_ROWS + i} scroll={scroll}>
              <Output frame={frame} line={line} />
            </Row>
          ) : null,
        )}

        {addShown ? (
          <Row row={ADD_ROW} scroll={scroll}>
            <Runs runs={command(ADD_TYPED.slice(0, addTyped))} />
          </Row>
        ) : null}
        {addShown && frame < T.addEnter && blink(addLast) ? (
          <Caret row={ADD_ROW} col={PROMPT_COLS + addTyped} scroll={scroll} />
        ) : null}

        {frame >= IDLE_AT ? (
          <>
            <Row row={IDLE_ROW} scroll={scroll}>
              <Runs runs={command("")} />
            </Row>
            {blink(IDLE_AT) ? (
              <Caret row={IDLE_ROW} col={PROMPT_COLS} scroll={scroll} />
            ) : null}
          </>
        ) : null}
      </div>
    </Window>
  )
}

/** Prompt + a typed command (+ an optional pasted tail). */
function command(typed: string, tail?: Run): Run[] {
  return [
    { text: PROMPT, color: C.blue },
    { text: " " },
    { text: " ", chevron: true },
    { text: " " },
    { text: typed.slice(0, 3), color: C.green },
    { text: typed.slice(3) },
    ...(tail?.text ? [tail] : []),
  ]
}

/** Split runs into rows of TERM.cols columns. */
function wrap(runs: Run[]): Run[][] {
  const rows: Run[][] = [[]]
  let col = 0
  for (const run of runs) {
    let text = run.text
    while (text.length > 0) {
      if (col === TERM.cols) {
        rows.push([])
        col = 0
      }
      const take = text.slice(0, TERM.cols - col)
      rows[rows.length - 1]!.push({ ...run, text: take })
      col += take.length
      text = text.slice(take.length)
    }
  }
  return rows
}

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.chevron ? (
          <Chevron key={i} />
        ) : run.text ? (
          <span
            key={i}
            style={{ color: run.color, background: run.bg, borderRadius: 3 }}
          >
            {run.text}
          </span>
        ) : null,
      )}
    </>
  )
}

function Row({
  row,
  scroll,
  children,
}: {
  row: number
  scroll: number
  children: ReactNode
}) {
  const top = (row - scroll) * TERM.line
  if (top < -TERM.line || top > TERM.rows * TERM.line) return null
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        height: TERM.line,
      }}
    >
      {children}
    </div>
  )
}

function Caret({
  row,
  col,
  scroll,
}: {
  row: number
  col: number
  scroll: number
}) {
  return (
    <span
      style={{
        position: "absolute",
        left: col * CH,
        top: (row - scroll) * TERM.line + (TERM.line - TERM.font * 1.2) / 2,
        width: CH,
        height: TERM.font * 1.2,
        background: C.fg,
        opacity: 0.85,
        borderRadius: 2,
      }}
    />
  )
}

function Output({ frame, line }: { frame: number; line: OutLine }) {
  if (line.kind === "file") {
    // The row stays behind, dimmed, as its card lifts off.
    const left = progress(frame, FLY_AT[line.file!]!, 8, ease.out)
    return (
      <span style={{ opacity: 1 - 0.75 * left }}>
        {line.segs.map(([text, color], i) => (
          <span key={i} style={{ color }}>
            {text}
          </span>
        ))}
      </span>
    )
  }
  const spinning = line.done !== undefined && frame < line.done
  return (
    <>
      {line.kind === "step" ? (
        spinning ? (
          <Spinner frame={frame - line.at} />
        ) : (
          <Check />
        )
      ) : null}
      {line.segs.map(([text, color], i) => (
        <span key={i} style={{ color }}>
          {text}
        </span>
      ))}
    </>
  )
}

/* Drawn marks, so nothing falls back to another face. */

function Cell({
  cols,
  children,
  style,
}: {
  cols: number
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        display: "inline-block",
        width: CH * cols,
        height: TERM.line,
        verticalAlign: "top",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </span>
  )
}

function Chevron() {
  return (
    <Cell cols={1}>
      <svg
        width={CH}
        height={TERM.line}
        viewBox={`0 0 ${CH} ${TERM.line}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <path
          d={`M${CH * 0.3} ${TERM.line * 0.33} L${CH * 0.72} ${TERM.line * 0.52} L${CH * 0.3} ${TERM.line * 0.71}`}
          fill="none"
          stroke={C.green}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Cell>
  )
}

function Mark({ children }: { children: ReactNode }) {
  return (
    <Cell cols={2}>
      <svg
        width={19}
        height={19}
        viewBox="0 0 16 16"
        style={{ position: "absolute", left: 0, top: (TERM.line - 19) / 2 }}
      >
        {children}
      </svg>
    </Cell>
  )
}

function Spinner({ frame }: { frame: number }) {
  return (
    <Mark>
      <g transform={`rotate(${frame * 30} 8 8)`}>
        <circle
          cx={8}
          cy={8}
          r={6}
          fill="none"
          stroke={C.blue}
          strokeOpacity={0.25}
          strokeWidth={2}
        />
        <path
          d="M8 2 A6 6 0 0 1 14 8"
          fill="none"
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
    </Mark>
  )
}

function Check() {
  return (
    <Mark>
      <path
        d="M3 8.5 L6.5 12 L13 4.5"
        fill="none"
        stroke={C.green}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Mark>
  )
}
