"use client"

/* /internal/compare: each part a reference pack measured, the product's
   crop (or its frozen copy) beside our specimen of it, live under the
   studio panel. A change in the panel re-renders the specimens and re-runs
   the probe, so the off values update as you tweak. Crops and part files
   come from .scratch-refs/<id>/ through refs-server.ts. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { CSSProperties, ReactNode } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { Label } from "@/registry/ui/field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { InternalHeader } from "@/modules/internal/shell"
import { getPreset } from "@/modules/presets"
import { postToIframe } from "@/modules/studio/preset/iframe-sync"
import { useDesignSystemMessage } from "@/modules/studio/preview/design-system-message"
import { PanelPopoverBoundary } from "@/modules/studio/rows"
import { getCurrent, select } from "@/modules/studio/selection"
import { StudioPanel } from "@/modules/studio/studio-panel"

import { compareMeasures } from "./compare"
import type { Row } from "./compare"
import { SPECIMEN_TARGETS, snippet } from "./probe"
import type { Measure, Measures, ReferenceTokens } from "./probe"
import type { RefsIndex } from "./refs-server"
import { SHEETS } from "./sheets"
import type { SheetName } from "./sheets"
import { fontFaces } from "./snapshot"
import type { PartFile, Snapshot, SnapshotFont } from "./snapshot"

const route = getRouteApi("/internal/compare")

type Mode = "light" | "dark"
type View = "side" | "onion" | "swipe" | "difference"

const PACKS = Object.fromEntries(
  Object.entries(
    import.meta.glob<ReferenceTokens>("./refs/*/tokens.json", {
      eager: true,
      import: "default",
    }),
  ).map(([path, tokens]) => [path.split("/")[2]!, tokens]),
)

/** The margin around each part, as the crops have it. */
const PAD = 16
const MAX_FRAME = { width: 640, height: 420 }

interface Read {
  measure: Measure | null
  rect: { x: number; y: number; width: number; height: number }
}

interface Settings {
  view: View
  amount: number
  copy: boolean
  passing: boolean
}

const Design = createContext<ReturnType<typeof useDesignSystemMessage> | null>(
  null,
)

export function ComparePage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const preset =
    search.preset && PACKS[search.preset] ? search.preset : "linear"
  const mode: Mode = search.mode ?? "light"
  const sheet = search.sheet ?? "all"
  const pack = PACKS[preset]!

  const [options, setSettings] = useState({
    amount: 50,
    copy: true,
    passing: false,
  })
  const settings: Settings = { ...options, view: search.view ?? "side" }
  const [offOnly, setOffOnly] = useState(false)
  const [offs, setOffs] = useState<Record<string, number>>({})
  const [boundary, setBoundary] = useState<HTMLElement | null>(null)
  const design = useDesignSystemMessage()

  // The studio shows the preset the reference recreates; edits from there
  // are the user's, in the studio's unsaved slot.
  useEffect(() => {
    const { doc, view } = getCurrent()
    if (!doc && view?.kind === "preset" && view.id === preset) return
    if (getPreset(preset)) select({ kind: "preset", id: preset })
  }, [preset])

  const refs = useRefs(preset)
  const parts = useMemo(
    () =>
      Object.entries(pack[mode] ?? {}).flatMap(([part, measure]) => {
        const specimen = SPECIMEN_TARGETS[part]
        return measure && specimen
          ? [{ part, measure, sheet: specimen.sheet }]
          : []
      }),
    [pack, mode],
  )
  const sheets = (Object.keys(SHEETS) as SheetName[]).filter((name) =>
    parts.some((p) => p.sheet === name),
  )
  const shown = parts.filter((p) => sheet === "all" || p.sheet === sheet)
  const measured = shown.filter((p) => offs[`${p.part}-${mode}`] !== undefined)
  const offCount = measured.reduce(
    (sum, p) => sum + (offs[`${p.part}-${mode}`] ?? 0),
    0,
  )

  const report = useCallback(
    (key: string, off: number) =>
      setOffs((prev) => (prev[key] === off ? prev : { ...prev, [key]: off })),
    [],
  )
  const go = (next: Partial<typeof search>) =>
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })

  return (
    <Design.Provider value={design}>
      <div className="flex h-svh bg-bg text-fg">
        <PanelPopoverBoundary.Provider value={boundary}>
          <aside
            ref={setBoundary}
            className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-border/45 p-3"
          >
            <StudioPanel />
          </aside>
        </PanelPopoverBoundary.Provider>
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border/45 bg-bg/95 px-6 pt-4 pb-3 backdrop-blur">
            <InternalHeader
              crumbs={[{ label: "Compare" }]}
              title="Compare"
              description={
                <>
                  The product's parts beside the studio's, measured live.{" "}
                  {measured.length} of {shown.length} parts measured, {offCount}{" "}
                  values off.
                </>
              }
            />
            <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
              <Select
                selectedKey={preset}
                onSelectionChange={(key) => go({ preset: String(key) })}
                className="w-40"
              >
                <Label>Reference</Label>
                <SelectTrigger />
                <SelectContent>
                  {Object.keys(PACKS).map((id) => (
                    <SelectItem key={id} id={id}>
                      {getPreset(id)?.name ?? id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                selectedKey={sheet}
                onSelectionChange={(key) => go({ sheet: String(key) })}
                className="w-36"
              >
                <Label>Sheet</Label>
                <SelectTrigger />
                <SelectContent>
                  {["all", ...sheets].map((name) => (
                    <SelectItem key={name} id={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Choice
                label="Mode"
                value={mode}
                options={["light", "dark"]}
                onChange={(next) => go({ mode: next as Mode })}
              />
              <Choice
                label="Theirs"
                value={settings.copy ? "copy" : "crop"}
                options={["copy", "crop"]}
                onChange={(next) =>
                  setSettings((s) => ({ ...s, copy: next === "copy" }))
                }
              />
              <Choice
                label="View"
                value={settings.view}
                options={["side", "onion", "swipe", "difference"]}
                onChange={(next) => go({ view: next as View })}
              />
              {(settings.view === "onion" || settings.view === "swipe") && (
                <Slider
                  value={settings.amount}
                  onChange={(amount) =>
                    setSettings((s) => ({ ...s, amount: amount as number }))
                  }
                  className="w-36"
                >
                  <Label>
                    {settings.view === "onion" ? "Theirs" : "Divider"}
                  </Label>
                  <SliderControl />
                </Slider>
              )}
              <Switch isSelected={offOnly} onChange={setOffOnly}>
                <SwitchControl />
                <Label>Off only</Label>
              </Switch>
              <Switch
                isSelected={settings.passing}
                onChange={(passing) => setSettings((s) => ({ ...s, passing }))}
              >
                <SwitchControl />
                <Label>Passing values</Label>
              </Switch>
            </div>
          </div>
          <div className="flex flex-col gap-10 px-6 py-6">
            {refs.error && (
              <p className="text-sm text-fg-muted">
                No crops for {preset}: {refs.error}
              </p>
            )}
            {(sheet === "all" ? sheets : [sheet as SheetName]).map((name) => (
              <section key={name} className="flex flex-col gap-6">
                <h2 className="font-mono text-xs tracking-wider text-fg-muted uppercase">
                  {name}
                </h2>
                {shown
                  .filter((p) => p.sheet === name)
                  .map(({ part, measure }) => (
                    <PartRow
                      key={`${preset}|${part}`}
                      preset={preset}
                      part={part}
                      mode={mode}
                      reference={measure}
                      fonts={pack.fonts}
                      files={refs.index?.[`${part}-${mode}`]}
                      settings={settings}
                      hidden={offOnly && offs[`${part}-${mode}`] === 0}
                      onOff={report}
                    />
                  ))}
              </section>
            ))}
          </div>
        </main>
      </div>
    </Design.Provider>
  )
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-fg-muted">{label}</span>
      <SegmentedControl
        aria-label={label}
        selectedKeys={[value]}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          const [next] = keys
          if (next !== undefined) onChange(String(next))
        }}
      >
        {options.map((option) => (
          <SegmentedControlItem key={option} id={option}>
            {option}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}

/** The preset's crops and part files, from the dev server. */
function useRefs(preset: string) {
  const [state, setState] = useState<{
    preset: string
    index?: RefsIndex
    error?: string
  }>({ preset })
  useEffect(() => {
    let live = true
    fetch(`/__preset-refs/${preset}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(
        (index: RefsIndex) => {
          if (!live) return
          setState({
            preset,
            index,
            error: Object.keys(index).length
              ? undefined
              : `nothing in .scratch-refs/${preset}/. Run pnpm presets:measure --pack ${preset} --shots .scratch-refs/${preset}/crops, or collect a local capture there.`,
          })
        },
        (error) => live && setState({ preset, error: String(error) }),
      )
    return () => {
      live = false
    }
  }, [preset])
  return state.preset === preset ? state : { preset }
}

const fileUrl = (preset: string, path: string) =>
  `/__preset-refs/${preset}/${path.split("/").map(encodeURIComponent).join("/")}`

function PartRow({
  preset,
  part,
  mode,
  reference,
  fonts,
  files,
  settings,
  hidden,
  onOff,
}: {
  preset: string
  part: string
  mode: Mode
  reference: Measure
  fonts?: Record<string, string>
  files?: { png?: string; json?: string }
  settings: Settings
  hidden: boolean
  onOff: (key: string, off: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useSeen(ref)
  const [read, setRead] = useState<Read | null>(null)
  const file = usePartFile(preset, files?.json)
  const [image, setImage] = useState<Image>()

  const theirs = useMemo((): Their | null => {
    const snapshot = settings.copy ? file?.snapshot : undefined
    if (snapshot)
      return {
        kind: "copy",
        snapshot,
        width: snapshot.width,
        height: snapshot.height,
        backdrop: snapshot.backdrop,
      }
    if (!files?.png) return null
    const dpr = file?.dpr ?? 1
    const crop = file?.crop ?? {
      left: PAD,
      top: PAD,
      width: image ? image.width / dpr - 2 * PAD : 0,
      height: image ? image.height / dpr - 2 * PAD : 0,
    }
    return {
      kind: "crop",
      src: fileUrl(preset, files.png),
      dpr,
      crop,
      width: crop.width,
      height: crop.height,
      backdrop: image?.backdrop,
    }
  }, [settings.copy, file, files?.png, preset, image])

  const rows = useMemo(
    () =>
      read?.measure
        ? compareMeasures(
            { [part]: reference },
            { [part]: read.measure },
            fonts,
          )
        : [],
    [read, part, reference, fonts],
  )
  const off = rows.filter((row) => !row.ok)
  useEffect(() => {
    if (read) onOff(`${part}-${mode}`, off.length)
  }, [read, off.length, part, mode, onOff])

  // One frame for both sides, each part centered in it; a page-sized part
  // shows its middle.
  const ours = read?.rect
  const frame = {
    width: Math.min(
      MAX_FRAME.width,
      Math.ceil(Math.max(theirs?.width ?? 0, ours?.width ?? 160)) + 2 * PAD,
    ),
    height: Math.min(
      MAX_FRAME.height,
      Math.ceil(Math.max(theirs?.height ?? 0, ours?.height ?? 40)) + 2 * PAD,
    ),
  }

  return (
    <div
      ref={ref}
      data-compare-part={part}
      className={cn("flex flex-col gap-2", hidden && "hidden")}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-sm font-medium">{part}</span>
        <span
          className={cn(
            "text-xs",
            !read ? "text-fg-muted" : off.length ? "text-fg" : "text-fg-muted",
          )}
        >
          {!read
            ? "measuring…"
            : read.measure
              ? `${off.length} of ${rows.length} off`
              : "no specimen match"}
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <Tile
          label={theirs ? `theirs · ${theirs.kind}` : "theirs"}
          frame={frame}
        >
          {theirs ? (
            <TheirLayer
              their={theirs}
              frame={frame}
              onImage={setImage}
              style={{}}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-fg-muted">
              no crop
            </span>
          )}
        </Tile>
        <Tile label="ours · live" frame={frame}>
          {visible && (
            <LiveSpecimen
              preset={preset}
              part={part}
              mode={mode}
              frame={frame}
              read={read}
              onRead={setRead}
            />
          )}
          {theirs && settings.view !== "side" && (
            <TheirLayer
              their={theirs}
              frame={frame}
              onImage={setImage}
              style={overlay(settings)}
            />
          )}
          {theirs && settings.view === "swipe" && (
            <span
              className="pointer-events-none absolute inset-y-0 w-px bg-[red]"
              style={{ left: `${settings.amount}%` }}
            />
          )}
        </Tile>
        {theirs?.kind === "copy" && (
          <FontNote
            fonts={theirs.snapshot.fonts}
            redacted={theirs.snapshot.redacted}
          />
        )}
      </div>
      {read?.measure && <DiffTable rows={settings.passing ? rows : off} />}
    </div>
  )
}

function overlay({ view, amount }: Settings): CSSProperties {
  if (view === "onion") return { opacity: amount / 100 }
  if (view === "swipe") return { clipPath: `inset(0 0 0 ${amount}%)` }
  return { mixBlendMode: "difference" }
}

function Tile({
  label,
  frame,
  children,
}: {
  label: string
  frame: { width: number; height: number }
  children: ReactNode
}) {
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="text-xs text-fg-muted">{label}</figcaption>
      <div
        className="relative isolate overflow-clip rounded-md outline outline-border/60"
        style={frame}
      >
        {children}
      </div>
    </figure>
  )
}

interface Image {
  width: number
  height: number
  backdrop?: string
}

type Their = { width: number; height: number; backdrop?: string } & (
  | { kind: "copy"; snapshot: Snapshot }
  | {
      kind: "crop"
      src: string
      dpr: number
      crop: NonNullable<PartFile["crop"]>
    }
)

/** Their part, centered in the frame over the page it sat on: the crop as
 *  an image, or the copy in a shadow root. */
function TheirLayer({
  their,
  frame,
  onImage,
  style,
}: {
  their: Their
  frame: { width: number; height: number }
  onImage: (image: Image) => void
  style: CSSProperties
}) {
  const [natural, setNatural] = useState<number>()
  const left = (frame.width - their.width) / 2
  const top = (frame.height - their.height) / 2
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: their.backdrop, ...style }}
    >
      {their.kind === "copy" ? (
        <SnapshotView
          snapshot={their.snapshot}
          style={{ position: "absolute", left, top }}
        />
      ) : (
        <img
          alt=""
          src={their.src}
          onLoad={(event) => {
            const img = event.currentTarget
            setNatural(img.naturalWidth)
            onImage({
              width: img.naturalWidth,
              height: img.naturalHeight,
              backdrop: cornerOf(img),
            })
          }}
          className="absolute max-w-none"
          style={{
            left: left - their.crop.left,
            top: top - their.crop.top,
            width: natural && natural / their.dpr,
          }}
        />
      )}
    </div>
  )
}

/** A crop's top-left pixel: the page around the part. */
function cornerOf(img: HTMLImageElement) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return undefined
  context.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

const loaded = new Map<string, Promise<boolean>>()

/** Adds a copy's fonts to the document (shadow roots ignore @font-face);
 *  false for each that didn't load, where a stand-in shows. */
function loadFonts(fonts: SnapshotFont[]) {
  return Promise.all(
    fonts.map((font) => {
      const key = fontFaces([font])
      let done = loaded.get(key)
      if (!done) {
        const face = new FontFace(font.family, font.src, {
          weight: font.weight,
          style: font.style,
          stretch: font.stretch,
          unicodeRange: font.unicodeRange,
        })
        document.fonts.add(face)
        done = face.load().then(
          () => true,
          () => false,
        )
        loaded.set(key, done)
      }
      return done
    }),
  )
}

function SnapshotView({
  snapshot,
  style,
}: {
  snapshot: Snapshot
  style: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" })
    root.innerHTML = `<style>:host{all:initial;display:block}\n${snapshot.css}</style>${snapshot.html}`
  }, [snapshot])
  return (
    <div
      ref={ref}
      className="pointer-events-none"
      style={{ ...style, width: snapshot.width, height: snapshot.height }}
    />
  )
}

function FontNote({
  fonts,
  redacted,
}: {
  fonts: SnapshotFont[]
  redacted: boolean
}) {
  const [missing, setMissing] = useState<string[]>([])
  useEffect(() => {
    let live = true
    void loadFonts(fonts).then((ok) => {
      if (live)
        setMissing([
          ...new Set(fonts.filter((_, i) => !ok[i]).map((f) => f.family)),
        ])
    })
    return () => {
      live = false
    }
  }, [fonts])
  if (!missing.length && !redacted) return null
  return (
    <p className="max-w-56 self-center text-xs text-fg-muted">
      {redacted && "Text replaced (signed in). "}
      {missing.length > 0 &&
        `Their ${missing.join(", ")} didn't load here: a stand-in shows.`}
    </p>
  )
}

function DiffTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return null
  return (
    <table className="w-fit text-left font-mono text-xs">
      <tbody>
        {rows.map((row) => (
          <tr key={row.prop} className={row.ok ? "text-fg-muted" : undefined}>
            <th className="py-0.5 pr-4 font-normal">{row.prop}</th>
            <td className="py-0.5 pr-4">
              <Value prop={row.prop} value={row.reference} />
            </td>
            <td className="py-0.5 pr-4">
              <Value prop={row.prop} value={row.preset} />
            </td>
            <td className="py-0.5">{row.delta}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Value({ prop, value }: { prop: string; value: string }) {
  const color = prop === "backgroundColor" || prop === "color"
  return (
    <span className="inline-flex max-w-80 items-center gap-1.5 truncate">
      {color && (
        <span
          className="size-3 shrink-0 rounded-sm outline outline-fg/15"
          style={{ background: value }}
        />
      )}
      {value}
    </span>
  )
}

/** Once the element has come near the viewport; it stays true. */
function useSeen(ref: React.RefObject<Element | null>) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setSeen(true),
      { rootMargin: "400px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, seen])
  return seen
}

function usePartFile(preset: string, path?: string) {
  const [file, setFile] = useState<{ path?: string; data?: PartFile }>({})
  useEffect(() => {
    if (!path) return
    let live = true
    fetch(fileUrl(preset, path))
      .then((res) => res.json() as Promise<PartFile>)
      .then(
        (data) => live && setFile({ path, data }),
        () => live && setFile({ path }),
      )
    return () => {
      live = false
    }
  }, [preset, path])
  return path && file.path === path ? file.data : undefined
}

type SpecimenWindow = Window & { eval: (code: string) => unknown }

/* Our part: its specimen sheet in a 1280×900 frame, so overlays and toasts
   sit where they do in the sheets, shifted until the part is centered in
   the tile. It follows the studio's design system and mode, and reads the
   part with the probe after each change. */
function LiveSpecimen({
  preset,
  part,
  mode,
  frame,
  read,
  onRead,
}: {
  preset: string
  part: string
  mode: Mode
  frame: { width: number; height: number }
  read: Read | null
  onRead: (read: Read | null) => void
}) {
  const iframe = useRef<HTMLIFrameElement>(null)
  const design = useContext(Design)!
  const { sheet, target } = SPECIMEN_TARGETS[part]!
  // Fixed at mount: mode and design changes go over postMessage.
  const [src] = useState(
    () => `/internal/specimens?preset=${preset}&mode=${mode}&sheet=${sheet}`,
  )
  const latest = useRef({ design, mode })
  useEffect(() => {
    latest.current = { design, mode }
  })

  const measure = useCallback(() => {
    const win = iframe.current?.contentWindow as SpecimenWindow | null
    const doc = iframe.current?.contentDocument
    if (!win || !doc?.documentElement?.hasAttribute("data-specimen-ready"))
      return false
    const result = win.eval(
      snippet({ [part]: target }, { mark: true }),
    ) as Measures
    const el = doc.querySelector(`[data-probe-part="${CSS.escape(part)}"]`)
    const box = el?.getBoundingClientRect()
    onRead({
      measure: result[part] ?? null,
      rect: box
        ? { x: box.x, y: box.y, width: box.width, height: box.height }
        : { x: 0, y: 0, width: 0, height: 0 },
    })
    return true
  }, [part, target, onRead])

  // Reads once the sheet is ready, then again after changes settle (fonts
  // and transitions land late).
  const remeasure = useCallback(() => {
    const timers = [300, 1000, 2500].map((ms) =>
      setTimeout(() => measure(), ms),
    )
    return () => timers.forEach(clearTimeout)
  }, [measure])

  const sync = useCallback(() => {
    const frameEl = iframe.current
    postToIframe(frameEl, latest.current.design.message)
    postToIframe(frameEl, { type: "preview-mode", mode: latest.current.mode })
  }, [])

  useEffect(() => {
    const frameEl = iframe.current
    if (!frameEl) return
    let poll: ReturnType<typeof setTimeout> | undefined
    const waitReady = (tries = 0) => {
      if (measure() || tries > 150) return
      poll = setTimeout(() => waitReady(tries + 1), 200)
    }
    const onLoad = () => {
      sync()
      waitReady()
    }
    const onReady = (event: MessageEvent) => {
      if (
        event.source === frameEl.contentWindow &&
        event.data?.type === "preview-ready"
      )
        sync()
    }
    frameEl.addEventListener("load", onLoad)
    window.addEventListener("message", onReady)
    return () => {
      clearTimeout(poll)
      frameEl.removeEventListener("load", onLoad)
      window.removeEventListener("message", onReady)
    }
  }, [measure, sync])

  useEffect(() => {
    sync()
    return remeasure()
  }, [design.key, mode, sync, remeasure])

  const rect = read?.rect
  const style: CSSProperties = rect
    ? {
        left: (frame.width - rect.width) / 2 - rect.x,
        top: (frame.height - rect.height) / 2 - rect.y,
      }
    : { left: 0, top: 0, visibility: "hidden" }
  return (
    <iframe
      ref={iframe}
      src={src}
      title={`${part} specimen`}
      className="pointer-events-none absolute h-[900px] w-[1280px] max-w-none border-0"
      style={style}
    />
  )
}
