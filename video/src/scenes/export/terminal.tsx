import { ease, progress } from "../../lib/motion"
import { Window } from "./chrome"
import {
  C,
  CH,
  FILES,
  FLY_AT,
  KEYS,
  MONO,
  OUTPUT,
  PASTED,
  PROMPT,
  T,
  TERM,
  TYPED,
} from "./data"
import { terminalScroll } from "./layout"

/* A zsh session running `shadcn init`: typed, pasted, spinners to checks. */

export function Terminal({ frame }: { frame: number }) {
  const scroll = terminalScroll(frame)
  const typed = KEYS.filter((k) => frame >= k).length
  const pasted = frame >= T.paste
  const lastKey = pasted ? T.paste : (KEYS[typed - 1] ?? 0)
  const running = frame >= T.enter
  const lastOut = OUTPUT[OUTPUT.length - 1]!
  const idle = frame >= lastOut.at + 6

  const promptCols = PROMPT.length + 3
  const commandCols = promptCols + typed + (pasted ? PASTED.length : 0)
  const blinkOn = (since: number) => (frame - since) % 60 < 34

  return (
    <Window
      width={TERM.w}
      height={TERM.h}
      bar={TERM.bar}
      title="my-app — zsh — 124×32"
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
        <Row index={0} scroll={scroll}>
          <Prompt />
          <span style={{ color: C.green }}>
            {TYPED.slice(0, Math.min(typed, 3))}
          </span>
          <span>{TYPED.slice(3, typed)}</span>
          {pasted ? (
            <span
              style={{
                color: C.string,
                background: `rgba(121,184,255,${0.24 * (1 - progress(frame, T.paste + 4, 26, ease.soft))})`,
                borderRadius: 3,
              }}
            >
              {PASTED}
            </span>
          ) : null}
          {!running && blinkOn(lastKey) ? <Caret col={commandCols} /> : null}
        </Row>
        {OUTPUT.map((line, i) =>
          frame >= line.at ? (
            <Row key={i} index={i + 1} scroll={scroll}>
              <OutputLine frame={frame} line={line} />
            </Row>
          ) : null,
        )}
        {idle ? (
          <Row index={OUTPUT.length + 1} scroll={scroll}>
            <Prompt />
            {blinkOn(lastOut.at + 6) ? <Caret col={promptCols} /> : null}
          </Row>
        ) : null}
      </div>
    </Window>
  )
}

function Row({
  index,
  scroll,
  children,
}: {
  index: number
  scroll: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: (index - scroll) * TERM.line,
        height: TERM.line,
      }}
    >
      {children}
    </div>
  )
}

function Prompt() {
  return (
    <>
      <span style={{ color: C.blue }}>{PROMPT}</span>
      <span style={{ color: C.green }}> ❯ </span>
    </>
  )
}

function Caret({ col }: { col: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: col * CH,
        top: (TERM.line - TERM.font * 1.2) / 2,
        width: CH,
        height: TERM.font * 1.2,
        background: C.fg,
        opacity: 0.85,
        borderRadius: 1.5,
      }}
    />
  )
}

function OutputLine({
  frame,
  line,
}: {
  frame: number
  line: (typeof OUTPUT)[number]
}) {
  if (line.kind === "file") {
    const i = FILES.indexOf(line.file as (typeof FILES)[number])
    const flash =
      frame >= FLY_AT[i]! ? 1 - progress(frame, FLY_AT[i]!, 22, ease.out) : 0
    const shipped = progress(frame, FLY_AT[i]!, 22, ease.out)
    const [prefix, name] = line.segs
    return (
      <>
        <span style={{ color: prefix![1] }}>{prefix![0]}</span>
        <span
          style={{
            color: name![1],
            opacity: 1 - 0.55 * shipped,
            background: `rgba(121,184,255,${0.3 * flash})`,
            borderRadius: 4,
          }}
        >
          {name![0]}
        </span>
      </>
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

/* Drawn marks, so the spinner and check never fall back to another face. */

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: CH * 2,
        height: TERM.line,
        verticalAlign: "top",
        position: "relative",
      }}
    >
      <svg
        width={17}
        height={17}
        viewBox="0 0 16 16"
        style={{ position: "absolute", left: 0, top: (TERM.line - 17) / 2 }}
      >
        {children}
      </svg>
    </span>
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
