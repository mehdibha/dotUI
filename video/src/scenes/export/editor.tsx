import type { CSSProperties } from "react"

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCodeIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@/registry/icons"
import { tokenizeTsx } from "@/modules/docs/highlight"

import { Cursor } from "../../lib/cursor"
import { clamp01, ease, lerp, progress } from "../../lib/motion"
import { Window } from "./chrome"
import { C, EDITOR, FILES, MONO, nameX, SANS, T, TREE } from "./data"
import type { TreeRow } from "./data"
import { landAt, treeRows } from "./layout"
import { BUTTON_SOURCE, COMPONENTS_JSON } from "./source"

/* The consumer's editor: the components.json init wrote, the tree the files
   land in, then the shipped button.tsx through the site's own tokenizer. */

const BUTTON = tokenizeTsx(BUTTON_SOURCE.trimEnd())
const CONFIG = tokenizeTsx(COMPONENTS_JSON)
const OPENED = TREE.findIndex((r) => r.name === "button.tsx")
/** The tv() call through the secondary variant: what the closing push reads. */
const FOCUS = { from: 10, to: 17 } as const

/** Lines of button.tsx scrolled past: eases in, then keeps rolling. */
function codeScroll(frame: number) {
  const d = frame - 276
  const rate = 0.075
  if (d <= 0) return 0
  return d < 40 ? (rate * d * d) / 80 : rate * (d - 20)
}

export function Editor({ frame }: { frame: number }) {
  const open = frame >= T.open
  const focus = progress(frame, 272, 44, ease.soft)
  return (
    <Window
      width={EDITOR.w}
      height={EDITOR.h}
      bar={EDITOR.bar}
      titleSize={15}
      title={`${open ? "button.tsx" : "components.json"} — my-app`}
    >
      <Sidebar frame={frame} />
      <div
        style={{
          position: "absolute",
          left: EDITOR.side,
          right: 0,
          top: EDITOR.bar,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <Tabs frame={frame} />
        {open ? null : (
          <Code lines={CONFIG} reveal={() => 1} scroll={3} opacity={0.62} />
        )}
        {open ? (
          <Code
            lines={BUTTON}
            reveal={(i) => progress(frame, T.open + 3 + i * 1.4, 22, ease.out)}
            dim={(i) =>
              i >= FOCUS.from && i <= FOCUS.to ? 1 : 1 - 0.55 * focus
            }
            band={{ ...FOCUS, amount: focus }}
            scroll={codeScroll(frame)}
            opacity={1}
          />
        ) : null}
        <Sweep frame={frame} />
      </div>
      <Cursor
        path={[
          [226, 520, 600],
          [238, 190, rowCentre(frame, OPENED)],
          [244, 190, rowCentre(frame, OPENED)],
          [266, 250, rowCentre(frame, OPENED) + 80],
        ]}
        clicks={[T.open]}
        from={226}
        to={262}
        size={1.25}
      />
    </Window>
  )
}

function rowCentre(frame: number, index: number) {
  const row = treeRows(frame)[index]!
  return row.top + row.height / 2
}

/** A soft light passing over the code as the closing push begins. */
function Sweep({ frame }: { frame: number }) {
  const t = progress(frame, 268, 64, ease.soft)
  if (t <= 0 || t >= 1) return null
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: lerp(-500, EDITOR.w, t),
        width: 420,
        background:
          "linear-gradient(100deg, transparent, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.075) 50%, rgba(255,255,255,0.05) 55%, transparent)",
        pointerEvents: "none",
      }}
    />
  )
}

function Sidebar({ frame }: { frame: number }) {
  const rows = treeRows(frame)
  const open = frame >= T.open
  const lib = TREE.findIndex((r) => r.name === "lib")
  const libFlash = FILES.reduce(
    (acc, f, i) =>
      TREE.some((r) => r.file === i) ? acc : Math.max(acc, flashAt(frame, i)),
    0,
  )
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: EDITOR.bar,
        width: EDITOR.side,
        bottom: 0,
        background: "rgba(255,255,255,0.018)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.38)",
        }}
      >
        EXPLORER
      </div>
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 50,
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.72)",
        }}
      >
        <ChevronDownIcon size={16} strokeWidth={2.25} />
        MY-APP
      </div>
      {rows.map(({ index, top, height }) => {
        if (height < 0.5) return null
        const row = TREE[index]!
        if (row.file !== undefined && frame < landAt(row.file)) return null
        const selected = open
          ? index === OPENED
          : row.name === "components.json"
        const flash =
          row.file !== undefined
            ? flashAt(frame, row.file)
            : index === lib
              ? libFlash
              : 0
        return (
          <div
            key={row.name}
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: top - EDITOR.bar,
              height,
              overflow: "hidden",
              borderRadius: 7,
              background:
                selected && open
                  ? "rgba(121,184,255,0.17)"
                  : selected
                    ? "rgba(255,255,255,0.06)"
                    : `rgba(121,184,255,${(0.2 * flash).toFixed(3)})`,
              boxShadow:
                selected && open
                  ? "inset 0 0 0 1px rgba(121,184,255,0.38)"
                  : undefined,
            }}
          >
            <TreeItem row={row} selected={selected && open} />
          </div>
        )
      })}
    </div>
  )
}

/** A landing flash: full for a few frames, then decays. */
function flashAt(frame: number, file: number) {
  const d = frame - landAt(file)
  if (d < 0) return 0
  return 1 - progress(d, 2, 20, ease.out)
}

function TreeItem({ row, selected }: { row: TreeRow; selected: boolean }) {
  const x = nameX(row.depth) - 8
  const icon: CSSProperties = {
    position: "absolute",
    top: (EDITOR.row - 20) / 2,
    left: x - 28,
    display: "flex",
  }
  const folder = row.kind === "folder"
  const code = row.name.endsWith(".tsx") || row.name.endsWith(".ts")
  return (
    <>
      {folder ? (
        <span style={{ ...icon, left: x - 50, color: "rgba(255,255,255,0.4)" }}>
          {row.open ? (
            <ChevronDownIcon size={20} strokeWidth={2} />
          ) : (
            <ChevronRightIcon size={20} strokeWidth={2} />
          )}
        </span>
      ) : null}
      <span
        style={{
          ...icon,
          color: folder ? C.folder : code ? C.blue : C.json,
        }}
      >
        {folder ? (
          row.open ? (
            <FolderOpenIcon size={20} strokeWidth={1.75} />
          ) : (
            <FolderIcon size={20} strokeWidth={1.75} />
          )
        ) : code ? (
          <FileCodeIcon size={20} strokeWidth={1.75} />
        ) : (
          <FileIcon size={20} strokeWidth={1.75} />
        )}
      </span>
      <span
        style={{
          position: "absolute",
          left: x,
          top: 0,
          lineHeight: `${EDITOR.row}px`,
          fontSize: EDITOR.tree,
          letterSpacing: "-0.005em",
          color: selected ? "#fff" : "rgba(255,255,255,0.8)",
          whiteSpace: "nowrap",
        }}
      >
        {row.name}
      </span>
    </>
  )
}

function Tabs({ frame }: { frame: number }) {
  const t = progress(frame, T.open, 14, ease.out)
  const open = frame >= T.open
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: EDITOR.tabs,
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.18)",
      }}
    >
      <Tab name="components.json" code={false} active={!open} />
      {open ? (
        <Tab
          name="button.tsx"
          code
          active
          style={{
            opacity: t,
            transform: `translateY(${(1 - t) * 8}px)`,
          }}
        />
      ) : null}
    </div>
  )
}

function Tab({
  name,
  code,
  active,
  style,
}: {
  name: string
  code: boolean
  active: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        height: EDITOR.tabs,
        padding: "0 22px 0 16px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        fontFamily: SANS,
        fontSize: 17,
        color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.42)",
        background: active
          ? "linear-gradient(180deg, #17171b, #111114)"
          : undefined,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: active ? `inset 0 2px 0 ${C.blue}` : undefined,
        ...style,
      }}
    >
      <span style={{ color: code ? C.blue : C.json, display: "flex" }}>
        {code ? (
          <FileCodeIcon size={18} strokeWidth={1.75} />
        ) : (
          <FileIcon size={18} strokeWidth={1.75} />
        )}
      </span>
      {name}
    </div>
  )
}

function Code({
  lines,
  reveal,
  dim = () => 1,
  band,
  scroll,
  opacity,
}: {
  lines: ReturnType<typeof tokenizeTsx>
  /** Per-line entrance, 0→1. */
  reveal: (line: number) => number
  /** Per-line brightness, for lines out of focus. */
  dim?: (line: number) => number
  /** A highlighted run of lines. */
  band?: { from: number; to: number; amount: number }
  scroll: number
  opacity: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: `${EDITOR.tabs + 16}px 0 0 0`,
        fontFamily: MONO,
        fontSize: EDITOR.font,
        lineHeight: `${EDITOR.line}px`,
        whiteSpace: "pre",
        opacity,
      }}
    >
      {band && band.amount > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: (band.from - scroll) * EDITOR.line - 6,
            height: (band.to - band.from + 1) * EDITOR.line + 12,
            background: `rgba(121,184,255,${(0.055 * band.amount).toFixed(3)})`,
            boxShadow: `inset 3px 0 0 rgba(121,184,255,${(0.6 * band.amount).toFixed(3)})`,
          }}
        />
      ) : null}
      {lines.map((tokens, i) => {
        const y = (i - scroll) * EDITOR.line
        if (y < -EDITOR.line || y > EDITOR.h) return null
        const t = reveal(i)
        if (t <= 0) return null
        const blur = lerp(6, 0, t)
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              height: EDITOR.line,
              opacity: t * dim(i),
              filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : undefined,
              transform: t < 1 ? `translateX(${(1 - t) * -16}px)` : undefined,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: EDITOR.gutter - 22,
                marginRight: 22,
                textAlign: "right",
                color: C.faint,
              }}
            >
              {i + 1}
            </span>
            {tokens.map((token, k) => (
              <span key={k} style={{ color: token.dark }}>
                {token.content}
              </span>
            ))}
          </div>
        )
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 84%, rgba(12,12,14,0.95) 100%)",
          opacity: clamp01(opacity * 2),
        }}
      />
    </div>
  )
}
