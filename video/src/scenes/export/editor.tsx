import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileCodeIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@/registry/icons"
import { tokenizeTsx } from "@/modules/docs/highlight"

import { clamp01, ease, keys, lerp, progress } from "../../lib/motion"
import { Window } from "./chrome"
import { C, EDITOR, FLIGHT, FLY_AT, MONO, nameX, SANS, T } from "./data"
import { flight, treeRows } from "./layout"
import type { PlacedRow } from "./layout"
import { BUTTON_SOURCE, COMPONENTS_JSON } from "./source"

/* The consumer's editor: the components.json init wrote, the tree the files
   land in, then the shipped button.tsx through the site's own tokenizer. */

const BUTTON = tokenizeTsx(BUTTON_SOURCE.trimEnd())
const CONFIG = tokenizeTsx(COMPONENTS_JSON)

export function Editor({ frame }: { frame: number }) {
  const open = frame >= T.open
  return (
    <Window
      width={EDITOR.w}
      height={EDITOR.h}
      bar={EDITOR.bar}
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
        {frame < T.open + 8 ? (
          <Code
            lines={CONFIG}
            reveal={() => 1}
            scroll={0}
            opacity={0.6 * (1 - progress(frame, T.open, 8, ease.linear))}
          />
        ) : null}
        {open ? (
          <Code
            lines={BUTTON}
            reveal={(i) => progress(frame, T.open + 3 + i * 1.3, 22, ease.out)}
            scroll={keys(frame, [
              [T.open + 40, 0],
              [359, 7.5],
            ])}
            opacity={1}
          />
        ) : null}
      </div>
    </Window>
  )
}

function Sidebar({ frame }: { frame: number }) {
  const rows = treeRows(frame)
  const open = frame >= T.open
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
          left: 18,
          top: 20,
          fontSize: 11.5,
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
          top: 46,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.72)",
        }}
      >
        <ChevronDownIcon size={14} strokeWidth={2.25} />
        MY-APP
      </div>
      {rows.map(({ key, top, height, row }) => {
        const landed = row.kind === "landed"
        if (landed && flight(frame, row.index) < 1) return null
        const selected = open
          ? row.name === "button.tsx"
          : row.name === "components.json"
        const flash = landed
          ? 1 - progress(frame, FLY_AT[row.index]! + FLIGHT, 24, ease.out)
          : 0
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: 6,
              right: 6,
              top: top - EDITOR.bar,
              height,
              borderRadius: 6,
              background:
                selected && open
                  ? "rgba(121,184,255,0.16)"
                  : selected
                    ? "rgba(255,255,255,0.06)"
                    : `rgba(121,184,255,${0.18 * flash})`,
              boxShadow:
                selected && open
                  ? "inset 0 0 0 1px rgba(121,184,255,0.35)"
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

function TreeItem({
  row,
  selected,
}: {
  row: PlacedRow["row"]
  selected: boolean
}) {
  const x = nameX(row.depth) - 6
  const icon = { position: "absolute", top: 6, left: x - 23 } as const
  const folder = row.kind === "folder"
  const code =
    row.kind === "landed" || (row.kind === "file" && row.lang === "tsx")
  return (
    <>
      {folder ? (
        <span style={{ ...icon, left: x - 39, color: "rgba(255,255,255,0.4)" }}>
          {row.open ? (
            <ChevronDownIcon size={16} strokeWidth={2} />
          ) : (
            <ChevronRightIcon size={16} strokeWidth={2} />
          )}
        </span>
      ) : null}
      <span
        style={{
          ...icon,
          color: folder ? "#c9a26d" : code ? C.blue : "#e3b341",
        }}
      >
        <TreeIcon folder={folder} open={folder && row.open} code={code} />
      </span>
      <span
        style={{
          position: "absolute",
          left: x,
          top: 0,
          lineHeight: `${EDITOR.row}px`,
          fontSize: 15,
          letterSpacing: "-0.005em",
          color: selected ? "#fff" : "rgba(255,255,255,0.78)",
          whiteSpace: "nowrap",
        }}
      >
        {row.name}
      </span>
    </>
  )
}

function TreeIcon({
  folder,
  open,
  code,
}: {
  folder: boolean
  open: boolean
  code: boolean
}) {
  const props = { size: 16, strokeWidth: 1.75 }
  if (folder)
    return open ? <FolderOpenIcon {...props} /> : <FolderIcon {...props} />
  return code ? <FileCodeIcon {...props} /> : <FileIcon {...props} />
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
            transform: `translateY(${(1 - t) * 6}px)`,
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
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        height: EDITOR.tabs,
        padding: "0 18px 0 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: SANS,
        fontSize: 14,
        color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.42)",
        background: active
          ? "linear-gradient(180deg, #16161a, #111114)"
          : undefined,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: active ? `inset 0 2px 0 ${C.blue}` : undefined,
        ...style,
      }}
    >
      <span style={{ color: code ? C.blue : "#e3b341", display: "flex" }}>
        {code ? (
          <FileCodeIcon size={16} strokeWidth={1.75} />
        ) : (
          <FileIcon size={16} strokeWidth={1.75} />
        )}
      </span>
      {name}
    </div>
  )
}

function Code({
  lines,
  reveal,
  scroll,
  opacity,
}: {
  lines: ReturnType<typeof tokenizeTsx>
  /** Per-line entrance, 0→1. */
  reveal: (line: number) => number
  scroll: number
  opacity: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: `${EDITOR.tabs + 14}px 0 0 0`,
        fontFamily: MONO,
        fontSize: EDITOR.font,
        lineHeight: `${EDITOR.line}px`,
        whiteSpace: "pre",
        opacity,
      }}
    >
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
              opacity: t,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
              transform: t < 1 ? `translateX(${(1 - t) * -14}px)` : undefined,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: EDITOR.gutter - 18,
                marginRight: 18,
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
            "linear-gradient(90deg, transparent 82%, rgba(12,12,14,0.95) 100%)",
          opacity: clamp01(opacity * 2),
        }}
      />
    </div>
  )
}
