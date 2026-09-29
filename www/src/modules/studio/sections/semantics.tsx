"use client"

/* Semantics: a tab per role; its card shows the role at work, curated picks,
   a hue and tone editor and a color field. */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import {
  CheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import type { LucideProps } from "lucide-react"
import {
  Button as RacButton,
  Slider as RacSlider,
  SliderThumb as RacSliderThumb,
  SliderTrack as RacSliderTrack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import {
  previewScale,
  STATUS_SEEDS,
  toOklch,
  WHISPER_LINE,
} from "@dotui/colors"
import type { Mode, ModeOutput, Oklch, StepName } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"

import { buildColorConfig, SEMANTIC_PICKS, SEMANTIC_ROLES } from "../axes/color"
import type { SemanticRole } from "../axes/color"
import { DIAL_LABEL, DIAL_PRESS, DIAL_ROW, DIAL_VALUE } from "../dial"
import { GROUP_LABEL } from "../rows"
import {
  atTone,
  clashFor,
  findClashes,
  isMoved,
  lstarAt,
  memo,
  parseSeed,
  sameHex,
  seedHex,
  shipped,
  shippedTone,
  TONE_MAX,
  TONE_SPLIT,
  withHue,
} from "../semantic-seeds"
import type { Party } from "../semantic-seeds"
import type { Studio, StudioState } from "../state"

type RoleKey = SemanticRole["key"]
type Palette = SemanticRole["palette"]
type Engine = Parameters<typeof previewScale>[2]

/* ---------------------------------- Inks ---------------------------------- */

/** What a role paints: the solid and its label, the soft wash, the text ink. */
interface Ink {
  solid: string
  on: string
  wash: string
  text: string
}

const scaleInk = (steps: Record<StepName, string>, on: string): Ink => ({
  solid: steps["700"],
  on,
  wash: steps["100"],
  text: steps["900"],
})

/** What a Primary source paints as the selection. */
function sourceInk(m: ModeOutput, source: string): Ink {
  const step = (palette: string, step: StepName) =>
    m.scales[palette]?.[step] ?? m.background
  if (source === "neutral")
    return {
      solid: step("neutral", "950"),
      on: step("neutral", "25"),
      wash: step("neutral", "200"),
      text: step("neutral", "950"),
    }
  return {
    solid: step("accent", "700"),
    on: m.on.accent?.["700"] ?? m.background,
    wash: step("accent", "100"),
    text: step("accent", "900"),
  }
}

function committedInk(m: ModeOutput, state: StudioState, role: SemanticRole) {
  const scale = m.scales[role.palette]
  if (!scale || (role.palette === "selection" && !state.selectionSeed))
    return sourceInk(m, state.selectionColor)
  return scaleInk(scale, m.on[role.palette]?.["700"] ?? m.background)
}

/** A candidate's whole ink in the panel's mode, for the specimen. */
const draftInk = memo((seed: string, mode: Mode, engine: Engine) => {
  const { steps, on } = previewScale(seed, mode, engine)
  return scaleInk(steps, on)
})

/** Where the custom editor starts while a role is Auto. */
const autoSeed = (state: StudioState, palette: Palette) =>
  palette === "selection" ? state.brand : STATUS_SEEDS[palette]

/* ---------------------------------- Glyphs -------------------------------- */

function BangIcon(props: LucideProps) {
  const { strokeWidth = 2, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      {...rest}
    >
      <path d="M12 6v8" />
      <path d="M12 18.5h.01" />
    </svg>
  )
}

const GLYPHS: Record<Palette, React.ComponentType<LucideProps>> = {
  success: CheckIcon,
  warning: BangIcon,
  danger: XIcon,
  selection: CheckIcon,
}

function RoleTile({
  name,
  palette,
  ink,
  custom,
  flagged,
}: {
  name: string
  palette: Palette
  ink: Ink
  custom: boolean
  flagged: boolean
}) {
  const Glyph = GLYPHS[palette]
  return (
    <span
      title={name}
      className={cn(
        "relative grid size-4 place-items-center inset-ring-1 inset-ring-fg/10",
        palette === "selection" ? "rounded-[4px]" : "rounded-full",
      )}
      style={{ background: ink.solid, color: ink.on }}
    >
      <Glyph strokeWidth={3} className="size-2.5" aria-hidden />
      {custom && (
        <span className="absolute -top-1 -right-1 size-1 rounded-full bg-accent" />
      )}
      {flagged && (
        <span className="absolute -right-1.25 -bottom-1.25 size-1.5 rounded-full bg-fg-warning" />
      )}
    </span>
  )
}

/* -------------------------------- Specimen -------------------------------- */

const GLYPH_TEXT = "text-[10.5px] leading-none font-semibold"

function Soft({
  ink,
  icon: Icon,
  children,
}: {
  ink: Ink
  icon: React.ComponentType<LucideProps>
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        GLYPH_TEXT,
        "flex h-5 items-center gap-1 rounded-md pr-1.5 pl-1",
      )}
      style={{ background: ink.wash, color: ink.text }}
    >
      <Icon strokeWidth={2.5} className="size-3" style={{ color: ink.solid }} />
      {children}
    </span>
  )
}

function Solid({ ink, children }: { ink: Ink; children: React.ReactNode }) {
  return (
    <span
      className={cn(GLYPH_TEXT, "flex h-5 items-center rounded-md px-2")}
      style={{ background: ink.solid, color: ink.on }}
    >
      {children}
    </span>
  )
}

function Text({ ink, children }: { ink: Ink; children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium" style={{ color: ink.text }}>
      {children}
    </span>
  )
}

/** The jobs a role's color does in the registry, at glyph scale. */
function Specimen({
  palette,
  ink,
  m,
  state,
}: {
  palette: Palette
  ink: Ink
  m: ModeOutput
  state: StudioState
}) {
  if (palette === "success")
    return (
      <>
        <Soft ink={ink} icon={CircleCheckIcon}>
          Paid
        </Soft>
        <Text ink={ink}>+12%</Text>
        <Solid ink={ink}>Confirm</Solid>
      </>
    )
  if (palette === "warning")
    return (
      <>
        <Soft ink={ink} icon={TriangleAlertIcon}>
          Trial ends
        </Soft>
        <Solid ink={ink}>Upgrade</Solid>
      </>
    )
  if (palette === "danger")
    return (
      <>
        <Text ink={ink}>Required</Text>
        <Soft ink={ink} icon={CircleXIcon}>
          Failed
        </Soft>
        <Solid ink={ink}>Delete</Solid>
      </>
    )
  // A control on another Primary source than the selection ignores its seed.
  const control = (source: string) =>
    source === state.selectionColor ? ink : sourceInk(m, source)
  const checkbox = control(state.checkboxColor)
  const toggle = control(state.switchColor)
  const radio = control(state.radioColor)
  return (
    <>
      <span
        className="flex h-6 items-center gap-1.5 rounded-md border pr-2 pl-1.5 text-[10.5px] font-medium"
        style={{
          background: checkbox.wash,
          borderColor: checkbox.solid,
          color: m.scales.neutral?.["950"],
        }}
      >
        <span
          className="grid size-3 place-items-center rounded-[3px]"
          style={{ background: checkbox.solid, color: checkbox.on }}
        >
          <CheckIcon strokeWidth={4} className="size-2" />
        </span>
        Annual
      </span>
      <span
        className="flex h-4 w-7 items-center justify-end rounded-full p-0.5"
        style={{ background: toggle.solid }}
      >
        <span className="size-3 rounded-full bg-thumb shadow-sm" />
      </span>
      <span
        className="size-3.5 rounded-full border-4"
        style={{ borderColor: radio.solid, background: radio.on }}
      />
    </>
  )
}

/** The header swatch: split diagonally when the engine moved the seed. */
function Swatch({ seed, solid }: { seed: string; solid: string }) {
  const moved = seed !== "" && isMoved(seed, solid)
  const ships = `Ships as ${seedHex(toOklch(solid))}`
  return (
    <span
      role={moved ? "img" : undefined}
      aria-label={moved ? ships : undefined}
      title={moved ? ships : undefined}
      className="size-4 shrink-0 rounded-full border border-fg/15"
      style={{
        background: moved
          ? `linear-gradient(135deg, ${seed} 50%, ${solid} 50%)`
          : solid,
      }}
    />
  )
}

/* ---------------------------------- Field --------------------------------- */

const toSeed = (raw: string) => (raw.trim() === "" ? "" : parseSeed(raw))

/** Any CSS color in; commits on Enter, blur, unmount, or a paste that parses. */
function SeedField({
  label,
  value,
  placeholder,
  onCommit,
}: {
  label: string
  value: string
  placeholder: string
  onCommit: (seed: string) => void
}) {
  const [text, setText] = useState<string | null>(null)
  const [invalid, setInvalid] = useState(false)
  const escaped = useRef(false)
  // A click inside an old selection collapses it on mouseup, after focus selects.
  const focusedByPointer = useRef(false)
  const select = (input: HTMLInputElement) =>
    requestAnimationFrame(() => input.select())
  const flush = (raw: string, current: string, commit: typeof onCommit) => {
    const seed = toSeed(raw)
    if (seed !== null && !sameHex(seed, current)) commit(seed)
  }
  const commit = (raw: string) => {
    const seed = toSeed(raw)
    if (seed === null) return setInvalid(true)
    setInvalid(false)
    if (!sameHex(seed, value)) onCommit(seed)
    setText(seed)
  }

  // A tab press unmounts the card before the field blurs.
  const latest = useRef({ text, value, onCommit })
  useLayoutEffect(() => {
    latest.current = { text, value, onCommit }
  })
  useEffect(
    () => () => {
      const { text, value, onCommit } = latest.current
      if (text !== null && !escaped.current) flush(text, value, onCommit)
    },
    [],
  )

  const shown = (text ?? value) || placeholder
  return (
    <input
      aria-label={`${label} color`}
      aria-invalid={invalid || undefined}
      value={text ?? value}
      placeholder={placeholder}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
      enterKeyHint="done"
      onMouseDown={(e) => {
        focusedByPointer.current = document.activeElement !== e.currentTarget
      }}
      onMouseUp={(e) => {
        if (!focusedByPointer.current) return
        focusedByPointer.current = false
        e.preventDefault()
      }}
      onFocus={(e) => {
        setText(value)
        select(e.currentTarget)
      }}
      onChange={(e) => {
        setText(e.target.value)
        setInvalid(false)
      }}
      onPaste={(e) => {
        const input = e.currentTarget
        const next =
          input.value.slice(0, input.selectionStart ?? 0) +
          e.clipboardData.getData("text") +
          input.value.slice(input.selectionEnd ?? input.value.length)
        if (!parseSeed(next)) return
        e.preventDefault()
        commit(next)
        select(input)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commit(text ?? value)
          select(e.currentTarget)
        } else if (e.key === "Escape") {
          escaped.current = true
          e.currentTarget.blur()
        }
      }}
      onBlur={() => {
        if (!escaped.current && text !== null) flush(text, value, onCommit)
        latest.current = { ...latest.current, text: null }
        escaped.current = false
        setText(null)
        setInvalid(false)
      }}
      // Sized to its text; 16px on touch against focus zoom, drawn at 13px.
      style={
        {
          "--w": `calc(${shown.length}ch + 0.923em + 1px)`,
        } as React.CSSProperties
      }
      className={cn(
        DIAL_VALUE,
        "h-[2.1538em] w-(--w) min-w-0 rounded-[0.4615em] bg-transparent px-[0.4615em] text-right uppercase outline-none placeholder:text-fg/70 placeholder:normal-case hover:bg-fg/5 focus:bg-fg/10 focus:text-fg aria-invalid:text-fg-danger",
        "pointer-coarse:-mx-[calc(var(--w)*0.09375)] pointer-coarse:-my-[0.2019em] pointer-coarse:scale-[0.8125] pointer-coarse:text-base",
      )}
    />
  )
}

/* ---------------------------------- Chips --------------------------------- */

const CHIP =
  "grid size-5 shrink-0 cursor-interactive place-items-center rounded-full outline-2 outline-offset-2 outline-transparent transition-[outline-color] duration-150 focus-visible:outline-border-focus pointer-coarse:size-7"

function Chip({
  id,
  name,
  color,
  onPreview,
  children,
}: {
  id: string
  name: string
  color: string
  onPreview: (on: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <RacToggleButton
      id={id}
      aria-label={name}
      onHoverChange={onPreview}
      onFocus={(e) => e.target.matches(":focus-visible") && onPreview(true)}
      onBlur={() => onPreview(false)}
      style={{ "--chip": color } as React.CSSProperties}
      className={cn(
        CHIP,
        "bg-(--chip) not-selected:not-focus-visible:hover:outline-fg/15 selected:not-focus-visible:outline-(--chip)",
      )}
    >
      <span title={name} className="grid size-full place-items-center">
        {children}
      </span>
    </RacToggleButton>
  )
}

/* The custom chip at rest: every hue, a ring. */
const HUE_RING = `conic-gradient(${Array.from(
  { length: 7 },
  (_, i) => `oklch(0.72 0.15 ${i * 60})`,
).join(", ")})`

/* --------------------------------- Sliders -------------------------------- */

// Paints inset by the thumb's radius: a value's color sits under the thumb.
const at = (t: number) => `calc(var(--r) + (100% - 2 * var(--r)) * ${t})`

const paint = (stops: { t: number; color: string }[]) =>
  `linear-gradient(to right, ${stops.map(({ t, color }) => `${color} ${at(t)}`).join(", ")})`

function SeedSlider({
  label,
  name,
  value,
  maxValue,
  track,
  mask,
  thumb,
  formatOptions,
  valueText,
  onChange,
  onChangeEnd,
  onKeyDownCapture,
}: {
  label: string
  name: string
  value: number
  maxValue: number
  track: string
  mask?: string
  thumb: string
  formatOptions?: Intl.NumberFormatOptions
  valueText?: string
  onChange: (value: number) => void
  onChangeEnd: (value: number) => void
  onKeyDownCapture?: (e: React.KeyboardEvent) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  // RAC only formats the raw value; a tone's position means nothing read aloud.
  useLayoutEffect(() => {
    if (valueText) input.current?.setAttribute("aria-valuetext", valueText)
  })
  return (
    <div
      onKeyDownCapture={onKeyDownCapture}
      className="flex flex-col gap-1.5 [--r:10px] pointer-coarse:[--r:14px]"
    >
      <span className={GROUP_LABEL}>{label}</span>
      <RacSlider
        aria-label={name}
        value={value}
        minValue={0}
        maxValue={maxValue}
        step={1}
        formatOptions={formatOptions}
        onChange={(v) => onChange(v as number)}
        onChangeEnd={(v) => onChangeEnd(v as number)}
      >
        {/* On touch only the thumb drags: a swipe over the track scrolls. */}
        <RacSliderTrack className="relative mx-(--r) h-5 cursor-interactive pointer-coarse:pointer-events-none pointer-coarse:h-7">
          <span
            className="absolute -inset-x-(--r) inset-y-0 rounded-full inset-ring-1 inset-ring-fg/10"
            style={{ background: track, maskImage: mask }}
          />
          <RacSliderThumb
            aria-label={name}
            inputRef={input}
            className="pointer-events-auto top-1/2 size-5 rounded-full border-2 border-thumb focus-reset ring-1 ring-overlay/40 focus-visible:focus-ring pointer-coarse:size-7"
            style={{ background: thumb }}
          />
        </RacSliderTrack>
      </RacSlider>
    </div>
  )
}

/** Every 15°, as each hue would commit. */
const hueTrack = memo(
  (base: Oklch, c: number, tone: number, vividness?: number) =>
    paint(
      Array.from({ length: 25 }, (_, i) => ({
        t: i / 24,
        color: shipped(
          seedHex(withHue(base, c, i * 15, tone, vividness)),
          vividness,
        ).solid,
      })),
    ),
)

/** Both bands, ends included. */
const toneTrack = memo((c: number, h: number, vividness?: number) =>
  paint(
    [
      0,
      5,
      10,
      15,
      20,
      TONE_SPLIT - 1,
      TONE_SPLIT,
      30,
      34,
      38,
      42,
      TONE_MAX,
    ].map((tone) => ({
      t: tone / TONE_MAX,
      color: shipped(seedHex(atTone(tone, c, h, vividness)), vividness).solid,
    })),
  ),
)

/* The label flip, cut out of the tone track. */
const FLIP = at((TONE_SPLIT - 0.5) / TONE_MAX)
const NOTCH = `linear-gradient(to right, #000 calc(${FLIP} - 2px), transparent 0 calc(${FLIP} + 2px), #000 0)`

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/* ---------------------------------- Card ---------------------------------- */

/** A seed this editor wrote: the chroma and hue it meant, and its tone. */
interface Written extends Oklch {
  hex: string
  tone?: number
}

type WrittenSeeds = Partial<Record<RoleKey, Written>>

interface Drag {
  slider: "hue" | "tone"
  value: number
  seed: string
}

function RoleCard({
  role,
  studio,
  m,
  mode,
  engine,
  solids,
  flagged,
  editing,
  setEditing,
  written,
  setWritten,
}: {
  role: SemanticRole
  studio: Studio
  m: ModeOutput
  mode: Mode
  engine: Engine
  solids: Record<Party, string>
  flagged: boolean
  editing: boolean
  setEditing: (editing: boolean) => void
  written: WrittenSeeds
  setWritten: React.Dispatch<React.SetStateAction<WrittenSeeds>>
}) {
  const { state, set } = studio
  const { key, palette, label } = role
  const value = state[key]
  const vividness = engine?.vividness
  const picks = SEMANTIC_PICKS[palette]
  const pick = picks.find((p) => sameHex(p.hex, value))
  const custom = value !== "" && !pick
  const editorId = useId()
  const healthRef = useRef<HTMLParagraphElement>(null)

  // A hovered or focused chip ('' = Auto) or a slider mid-drag, until it lands.
  const [hover, setHover] = useState<string | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [landed, setLanded] = useState(value)
  if (landed !== value) {
    setLanded(value)
    setDrag(null)
  }

  const commit = (seed: string) => {
    if (sameHex(seed, value)) setDrag(null)
    else set(key)(seed)
  }

  const committed = committedInk(m, state, role)
  const draft = drag?.seed ?? hover
  const ink =
    draft === null || (draft === "" && value === "")
      ? committed
      : draft === ""
        ? palette === "selection"
          ? sourceInk(m, state.selectionColor)
          : draftInk(STATUS_SEEDS[palette], mode, engine)
        : draftInk(draft, mode, engine)

  const auto =
    palette === "selection"
      ? sourceInk(m, state.selectionColor)
      : shipped(STATUS_SEEDS[palette], vividness)
  const clash = clashFor(
    findClashes({ ...solids, [palette]: ink.solid }),
    palette,
  )

  // Docked, a commit that flags the role brings its health line into view.
  const wasFlagged = useRef(flagged)
  useEffect(() => {
    if (flagged && !wasFlagged.current)
      healthRef.current?.scrollIntoView({ block: "nearest" })
    wasFlagged.current = flagged
  }, [flagged])

  // The editor moves the committed seed, else Auto's; a gray borrows a hue.
  const seed = value || autoSeed(state, palette)
  const mine = written[key]
  const own = mine && sameHex(mine.hex, seed) ? mine : undefined
  const base: Oklch = own ?? toOklch(seed)
  const lend =
    base.c < WHISPER_LINE
      ? ([autoSeed(state, palette), ...picks.map((p) => p.hex)]
          .map(toOklch)
          .find((color) => color.c >= WHISPER_LINE) ?? base)
      : base
  const { c: chroma, h: hue } = lend
  const shownHue = Math.round(hue)
  const tone = own?.tone ?? shippedTone(seed, vividness)
  const hueValue = drag?.slider === "hue" ? drag.value : shownHue
  const toneValue = drag?.slider === "tone" ? drag.value : tone

  // Steps from the exact hue, so a step and its undo land back on the seed.
  const hueSeed = (h: number) =>
    withHue(base, chroma, hue + h - shownHue, tone, vividness)
  const toneSeed = (t: number) => atTone(t, chroma, hue, vividness)
  // Written as state: a step that lands on the same hex still moves the thumb.
  const write = (next: Oklch, nextTone?: number) => {
    const hex = seedHex(next)
    setWritten((w) => ({ ...w, [key]: { ...next, hex, tone: nextTone } }))
    commit(hex)
  }
  const thumb = shipped(drag?.seed ?? seed, vividness).solid

  return (
    <>
      <div className="flex h-9 items-center justify-between gap-2 pointer-coarse:h-10">
        <span className={DIAL_LABEL}>{label}</span>
        <span className="-mr-0.5 flex min-w-0 items-center gap-0.5">
          {clash && (
            <TriangleAlertIcon
              role="img"
              aria-label={clash.detail}
              className="size-3.5 shrink-0 text-fg-warning"
            >
              <title>{clash.detail}</title>
            </TriangleAlertIcon>
          )}
          <SeedField
            label={label}
            value={drag?.seed ?? value}
            placeholder={palette === "selection" ? "Primary" : "Auto"}
            onCommit={commit}
          />
          <Swatch seed={draft ?? value} solid={ink.solid} />
        </span>
      </div>

      <div
        className="flex h-9 items-center justify-between gap-2 rounded-md px-2 inset-ring-1 inset-ring-fg/8"
        style={{ background: m.background }}
      >
        <Specimen palette={palette} ink={ink} m={m} state={state} />
      </div>

      <div className="mt-3 flex items-center gap-2.5 pointer-coarse:gap-3">
        <RacToggleButtonGroup
          aria-label={`${label} presets`}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={value === "" ? ["auto"] : pick ? [pick.hex] : []}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value as string | undefined
            if (next !== undefined) commit(next === "auto" ? "" : next)
          }}
          className="flex items-center gap-2.5 pointer-coarse:gap-3"
        >
          <Chip
            id="auto"
            name={palette === "selection" ? "Primary" : "Auto"}
            color={auto.solid}
            onPreview={(on) => setHover(on ? "" : null)}
          >
            <span
              className="text-[10px] leading-none font-bold"
              style={{ color: auto.on }}
            >
              A
            </span>
          </Chip>
          {picks.map((p) => (
            <Chip
              key={p.hex}
              id={p.hex}
              name={p.name}
              color={shipped(p.hex, vividness).solid}
              onPreview={(on) => setHover(on ? p.hex : null)}
            />
          ))}
        </RacToggleButtonGroup>
        <RacButton
          aria-label={`Custom ${label.toLowerCase()} color`}
          aria-expanded={editing}
          aria-controls={editing ? editorId : undefined}
          onPress={() => setEditing(!editing)}
          style={{ "--chip": committed.solid } as React.CSSProperties}
          className={cn(
            CHIP,
            "-mr-0.5 ml-auto",
            custom
              ? "bg-(--chip) not-focus-visible:outline-(--chip)"
              : "not-focus-visible:hover:outline-fg/15 not-focus-visible:aria-expanded:outline-fg/25",
          )}
        >
          <span title="Custom" className="grid size-full place-items-center">
            {!custom && (
              <span
                className="size-full rounded-full"
                style={{
                  background: HUE_RING,
                  maskImage:
                    "radial-gradient(closest-side, transparent 55%, #000 60%)",
                }}
              />
            )}
          </span>
        </RacButton>
      </div>

      {editing && (
        <div id={editorId} className="mt-3 flex flex-col gap-3">
          <SeedSlider
            label="Hue"
            name={`${label} hue`}
            value={hueValue}
            maxValue={360}
            track={hueTrack(base, chroma, tone, vividness)}
            thumb={thumb}
            formatOptions={{
              style: "unit",
              unit: "degree",
              unitDisplay: "long",
            }}
            onChange={(h) =>
              setDrag({ slider: "hue", value: h, seed: seedHex(hueSeed(h)) })
            }
            onChangeEnd={(h) =>
              h === shownHue ? setDrag(null) : write(hueSeed(h))
            }
            onKeyDownCapture={(e) => {
              const dir = {
                ArrowRight: 1,
                ArrowUp: 1,
                ArrowLeft: -1,
                ArrowDown: -1,
              }[e.key]
              if (!e.shiftKey || !dir) return
              e.preventDefault()
              e.stopPropagation()
              write(hueSeed(clamp(shownHue + dir * 10, 0, 360)))
            }}
          />
          <SeedSlider
            label="Tone"
            name={`${label} tone`}
            value={toneValue}
            maxValue={TONE_MAX}
            track={toneTrack(chroma, hue, vividness)}
            mask={NOTCH}
            thumb={thumb}
            valueText={`Lightness ${lstarAt(toneValue)}`}
            onChange={(t) =>
              setDrag({ slider: "tone", value: t, seed: seedHex(toneSeed(t)) })
            }
            onChangeEnd={(t) =>
              t === tone ? setDrag(null) : write(toneSeed(t), t)
            }
          />
        </div>
      )}

      {clash && (
        <p
          ref={healthRef}
          title={clash.detail}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-fg/70 dock-stacked:scroll-mb-[calc(var(--dock-chrome)+24px)]"
        >
          <TriangleAlertIcon className="size-3.5 shrink-0 text-fg-warning" />
          {clash.label}
        </p>
      )}
    </>
  )
}

/* ----------------------------------- Row ---------------------------------- */

export function Semantics({
  studio,
  m,
  mode,
}: {
  studio: Studio
  m: ModeOutput
  mode: Mode
}) {
  const { state } = studio
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<RoleKey>("successSeed")
  const [editing, setEditing] = useState(false)
  const [written, setWritten] = useState<WrittenSeeds>({})
  // Whether the pressed tab was the open one — read before the press selects.
  const wasOpen = useRef(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Docked, the dock is short: a card that opens, swaps or grows comes into view.
  useEffect(() => {
    if (open) panelRef.current?.scrollIntoView({ block: "nearest" })
  }, [open, active, editing])

  const { vividness, background } = buildColorConfig(state)
  const engine: Engine = { vividness, background }
  const inks = Object.fromEntries(
    SEMANTIC_ROLES.map((role) => [role.key, committedInk(m, state, role)]),
  ) as Record<RoleKey, Ink>
  const solids: Record<Party, string> = {
    success: inks.successSeed.solid,
    warning: inks.warningSeed.solid,
    danger: inks.dangerSeed.solid,
    selection: inks.selectionSeed.solid,
    info: m.scales.info?.["700"] ?? m.background,
    brand: m.scales.accent?.["700"] ?? m.background,
  }
  const clashes = findClashes(solids)
  const role = SEMANTIC_ROLES.find((r) => r.key === active) ?? SEMANTIC_ROLES[0]

  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => {
        setActive(key as RoleKey)
        setOpen(true)
      }}
      className="flex flex-col gap-1.5"
    >
      <div className={cn(DIAL_ROW, "relative pr-0.5")}>
        <RacButton
          aria-label="Semantics"
          aria-expanded={open}
          aria-controls={panelId}
          onPress={() => setOpen(!open)}
          className={cn(DIAL_PRESS, "absolute inset-0 rounded-[inherit]")}
        />
        <span className={cn(DIAL_LABEL, "pointer-events-none relative")}>
          Semantics
        </span>
        <TabList
          aria-label="Semantic colors"
          className="pointer-events-none relative flex p-0.5 pointer-coarse:gap-4"
        >
          {SEMANTIC_ROLES.map((role) => {
            const custom = state[role.key] !== ""
            const health = clashFor(clashes, role.palette)
            const name = [role.label, custom && "custom", health?.label]
              .filter(Boolean)
              .join(", ")
            return (
              <Tab
                key={role.key}
                id={role.key}
                aria-label={name}
                onPressStart={() => {
                  wasOpen.current = open && role.key === active
                }}
                onPress={() => setOpen(!wasOpen.current)}
                className={cn(
                  "pointer-events-auto relative grid size-7 cursor-interactive place-items-center rounded-md focus-reset focus-visible:focus-ring pointer-coarse:after:absolute pointer-coarse:after:-inset-x-2 pointer-coarse:after:-inset-y-1",
                  open
                    ? "not-selected:*:opacity-85 not-selected:hover:*:opacity-100 selected:bg-fg/10"
                    : "hover:bg-fg/5",
                )}
              >
                <RoleTile
                  name={name}
                  palette={role.palette}
                  ink={inks[role.key]}
                  custom={custom}
                  flagged={Boolean(health)}
                />
              </Tab>
            )
          })}
        </TabList>
      </div>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="dock-stacked:scroll-mb-[calc(var(--dock-chrome)+12px)]"
      >
        {/* Remounted per tab: a deselected RAC panel lingers and skews the scroll. */}
        <TabPanel
          key={active}
          id={active}
          className="flex flex-col rounded-lg tint-5 px-3 pb-3 focus-reset focus-visible:focus-ring"
        >
          {open && (
            <RoleCard
              role={role}
              studio={studio}
              m={m}
              mode={mode}
              engine={engine}
              solids={solids}
              flagged={Boolean(clashFor(clashes, role.palette))}
              editing={editing}
              setEditing={setEditing}
              written={written}
              setWritten={setWritten}
            />
          )}
        </TabPanel>
      </div>
    </Tabs>
  )
}
