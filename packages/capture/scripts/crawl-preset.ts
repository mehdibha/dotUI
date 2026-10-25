/**
 * The census (src/census.ts) over a product's pages:
 * every element each page paints or labels, its role and about 40 values, at
 * rest, hovered, pressed and focused, and set disabled, invalid and selected,
 * in both modes. Then the looks per role (census.json) and the model
 * (refs/<id>/model.json, see model.ts). Run from www/.
 *
 *   pnpm presets:crawl --pack <id> [--url <url>]… [--follow <n>] [--open <n>]
 *       [--tips <n>] [--args <n>] [--stories <n>]
 *     Headless, the pack's public pages with their mode, dark URL, storage,
 *     steps, settle and width (targets.json), each distinct `before` step
 *     list and each of the page's `passes` as one more pass (what it opens).
 *     --url keeps only those pages (any page, in the pack or not); --follow
 *     adds up to n same-site pages linked from them. On each page the census
 *     also finds what opens, in place: up to --open popups, menus,
 *     disclosures and dialog triggers of distinct looks (8), each clicked
 *     and closed with Escape (a reload when one stays open); up to --tips
 *     tooltips (6), hovered or focused; and on a
 *     Storybook story, each option of its variant, size and boolean args
 *     (--args passes, 40), set in place. --stories walks every story of
 *     the components each Storybook the pack reads shows, and of up to n
 *     more of its components (off by default; 999 walks them all); the
 *     extra stories get no popups, tooltips or args passes.
 *
 *   pnpm presets:crawl --pack <id> --connect <port> --pages <file> [--mode light|dark|both]
 *     The same in a Chrome you are signed in to, started with
 *     --remote-debugging-port=<port> (the local capture's research Chrome),
 *     in new tabs of your profile. <file> maps each page key, with account
 *     segments as placeholders, to its real URL; real URLs are never
 *     written. Modes are emulated (prefers-color-scheme): a product with an
 *     appearance setting needs it set by hand, one mode per run. Clicks only
 *     with --passes (a pack page's `before` steps and `passes`) or --open:
 *     tooltips are hovered and states set, which changes nothing the
 *     account keeps.
 *
 *   pnpm presets:crawl --pack <id> --from <census dir>…
 *     Rebuilds census.json and the model from saved pages, no browser: how a
 *     public run and a signed-in one become one model.
 *
 *   pnpm presets:crawl --pack <id> --drift
 *     Re-runs the headless census and prints what moved against the
 *     committed model, on the pages both share. Writes no model: rebuild it
 *     with --from to keep the signed-in pages.
 *
 * Writes <out>/pages/<page>-<pass>-<mode>.json, <out>/census.json, the
 * model, frozen copies of each look's sample at rest and in its states
 * (--copies per pass, 120 by default; redacted with --connect) as
 * <out>/crops/<look>-<state>-<mode>.{json,html}, which looks.json points at
 * (presets:looks), and a shot of each pass (the whole page at rest, else the
 * viewport, where the page's `shotAt` says it starts) as
 * <out>/shots/<page>-<pass hash>-<mode>.jpg (--no-shots skips them; with
 * --connect, only --shots writes them, unredacted). <out> is
 * .scratch-refs/<id>/<date>/census by default: never in git.
 */
import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer, { type Browser, type Page } from "puppeteer"

import {
  type CensusElement,
  type CensusPage,
  censusSnippet,
  changed,
  cluster,
  FORCED,
  type Forced,
  groupOf,
  type Inventory,
  lookKeys,
  type State,
  trim,
  type Values,
} from "../src/census"
import {
  buildModel,
  diffModels,
  jsonLines,
  type Model,
  summarize,
} from "../src/model"
import type { Step } from "../src/probe"
import {
  COPY_AREA,
  type PartFile,
  type Snapshot,
  snapshotSnippet,
} from "../src/snapshot"
import {
  focusable,
  launch,
  type Mode,
  openPage,
  type PackPage,
  pause,
  pool,
  PROBE,
  REFS,
  runSteps,
  say,
  settle,
  shim,
  SRC,
  versionOf,
} from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string" },
    url: { type: "string", multiple: true, default: [] },
    follow: { type: "string", default: "0" },
    open: { type: "string" },
    tips: { type: "string", default: "6" },
    args: { type: "string", default: "40" },
    stories: { type: "string", default: "0" },
    connect: { type: "string" },
    pages: { type: "string" },
    passes: { type: "boolean", default: false },
    mode: { type: "string", default: "both" },
    from: { type: "string", multiple: true, default: [] },
    drift: { type: "boolean", default: false },
    out: { type: "string" },
    max: { type: "string", default: "5000" },
    states: { type: "string", default: "80" },
    copies: { type: "string", default: "120" },
    concurrency: { type: "string", default: "2" },
    shots: { type: "boolean" },
  },
  allowNegative: true,
})

if (!args.pack) {
  console.error("--pack <id> is required")
  process.exit(1)
}
const pack = args.pack
const MODES = (args.mode === "both" ? ["light", "dark"] : [args.mode]) as Mode[]
// A signed-in page's shot shows the account unredacted: only when asked.
const SHOTS = args.shots ?? !args.connect
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error("--mode must be light, dark or both")
  process.exit(1)
}
const CENSUS = versionOf(resolve(SRC, "census.ts"), resolve(SRC, "probe.ts"))
const today = new Date().toISOString().slice(0, 10)
const OUT = resolve(args.out ?? `.scratch-refs/${pack}/${today}/census`)
const modelFile = resolve(REFS, pack, "model.json")
// Signed-in pages keep no text, values or images in their copies.
const REDACT = !!args.connect
// A signed-in page clicks only what it's told to.
const OPEN = Number(args.open ?? (args.connect ? "0" : "8"))
const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8")) as T

/** Roles a pointer or the keyboard can change. */
const INTERACTIVE = new Set([
  "button",
  "link",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "checkbox",
  "radio",
  "switch",
  "textbox",
  "searchbox",
  "combobox",
  "slider",
  "spinbutton",
  "treeitem",
  "select",
  "row",
  "cell",
  "toggle",
  "segment",
  "breadcrumb",
  "pagination-item",
])

/** One element per look of a pass, most-used looks first: the ones whose
 *  states and custom properties are read. */
function representatives(elements: CensusElement[], only?: Set<string>) {
  const looks = new Map<string, CensusElement[]>()
  for (const element of elements) {
    if (only && !only.has(element.role)) continue
    const keys = lookKeys(element.role)
    const sig = `${groupOf(element)} ${JSON.stringify(keys.map((key) => element.values[key] ?? ""))}`
    looks.set(sig, [...(looks.get(sig) ?? []), element])
  }
  return [...looks.values()]
    .sort((a, b) => b.length - a.length)
    .map(([first]) => first as CensusElement)
}

/* Frozen copies (snapshot.ts) of each look's sample, at rest and in each
   state read: what a system page shows beside our part. Kept per page,
   pass and mode, by census id. */
type Copies = Record<number, Partial<Record<"rest" | State | Forced, Snapshot>>>
const COPIES = new Map<string, Copies>()
const copiesOf = (key: string, pass: string, mode: Mode) =>
  `${key}|${pass}|${mode}`
const BOXLESS = new Set([
  "page",
  "text",
  "paragraph",
  "time",
  "blockquote",
  "main",
  "region",
  "list",
  "listitem",
  "group",
  "article",
  "banner",
  "contentinfo",
  "complementary",
  "navigation",
])

const freeze = async (page: Page, ids: number[]) =>
  ids.length
    ? ((await page.evaluate(
        snapshotSnippet({
          attribute: "data-census",
          // A framed field's copy is its frame.
          prefer: "data-census-frame",
          redact: REDACT,
          keys: ids.map(String),
        }),
      )) as Record<string, Snapshot>)
    : {}

const finish = (page: Page) =>
  page.evaluate(() => {
    for (const animation of document.getAnimations())
      if (animation.effect?.getComputedTiming().iterations !== Infinity)
        try {
          animation.finish()
        } catch {
          // Some animations can't finish (an infinite delay).
        }
  })

const read = async (page: Page, id: number, focus = false) =>
  (
    (await page.evaluate(
      censusSnippet({ kind: "read", ids: [id], focus }),
    )) as Record<string, Values>
  )[id] ?? null

/* Hovered with the pointer (so script-driven hovers show too), pressed and
   focused forced through the DevTools protocol (on the rest pass with a
   keyboard round trip, so script focus rings show too), then disabled,
   invalid and selected set on the element (census `force`), where it has
   none of them already. Each state is undone before the next. Only what a
   state changes is kept. With something open (a menu), `keys` is false: no
   Tab or Escape, which would close it. */
async function readStates(
  page: Page,
  elements: CensusElement[],
  copies: Copies,
  keys: boolean,
) {
  const cdp = await page.createCDPSession()
  await cdp.send("DOM.enable")
  await cdp.send("CSS.enable")
  await cdp.send("DOM.getDocument", { depth: -1, pierce: true })
  const url = page.url()
  /* The node in this session: an object id from Puppeteer's own session
     isn't valid here. */
  const nodeOf = async (id: number) => {
    const { result } = await cdp.send("Runtime.evaluate", {
      expression: censusSnippet({ kind: "node", id }),
    })
    if (!result.objectId) return undefined
    return (await cdp.send("DOM.requestNode", { objectId: result.objectId }))
      .nodeId
  }
  const force = (nodeId: number, classes: string[]) =>
    cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: classes })
  const set = (element: CensusElement, state: Forced | null) =>
    page.evaluate(
      censusSnippet({
        kind: "force",
        id: element.id,
        state,
        role: element.role,
      }),
    ) as Promise<boolean>
  for (const element of elements) {
    if (page.url() !== url) break
    const handle = await page.$(`>>> [data-census="${element.id}"]`)
    const nodeId = handle && (await nodeOf(element.id).catch(() => undefined))
    if (!handle || !nodeId) {
      await handle?.dispose()
      continue
    }
    const states: Partial<Record<State | Forced, Values>> = {}
    const forced: Forced[] = []
    const copy = async (state: State | Forced) => {
      const frozen =
        copies[element.id] && (await freeze(page, [element.id]))[element.id]
      if (frozen)
        copies[element.id] = { ...copies[element.id], [state]: frozen }
    }
    try {
      await handle.hover()
      await pause(60)
      await finish(page)
      const hover = await read(page, element.id)
      // The pointer may have scrolled the page, which moves nothing a look
      // is made of.
      if (hover) states.hover = changed(element.values, hover)
      await copy("hover")
      await page.mouse.move(0, 0)
      await force(nodeId, ["hover", "active"])
      await finish(page)
      const pressed = await read(page, element.id)
      if (pressed) states.pressed = changed(element.values, pressed)
      await copy("pressed")
      await force(nodeId, [])
      if (element.focusable) {
        await handle.focus()
        if (keys) {
          await page.keyboard.press("Tab")
          await page.keyboard.down("Shift")
          await page.keyboard.press("Tab")
          await page.keyboard.up("Shift")
          if (!(await handle.evaluate((el) => el === document.activeElement)))
            await handle.focus()
        }
        await force(nodeId, ["focus", "focus-visible", "focus-within"])
        await finish(page)
        const focus = await read(page, element.id, true)
        if (focus) states.focus = changed(element.values, focus)
        await copy("focus")
        await force(nodeId, [])
        await handle.evaluate((el) => (el as HTMLElement).blur?.())
      }
      if (!element.is)
        for (const state of FORCED) {
          if (!(await set(element, state))) continue
          await finish(page)
          const values = await read(page, element.id)
          const diff = values ? changed(element.values, values) : {}
          delete diff.width
          if (Object.keys(diff).length) {
            states[state] = diff
            forced.push(state)
            await copy(state)
          }
          await set(element, null)
        }
    } catch {
      // Detached or covered: keep what was read.
    } finally {
      await set(element, null).catch(() => {})
      if (keys) await page.keyboard.press("Escape").catch(() => {})
      await handle.dispose()
    }
    for (const [state, values] of Object.entries(states) as [
      State | Forced,
      Values,
    ][]) {
      delete values.width
      if (!Object.keys(values).length) delete states[state]
    }
    if (Object.keys(states).length) element.states = states
    if (forced.length) element.forced = forced
  }
  await cdp.detach()
}

/** One pass over the page as it stands: the walk, the states of each
 *  interactive look, and the custom properties behind every look. A pass
 *  after "rest" reads only what is new or changed since `seen` (only what
 *  is new after a hover), and is null when nothing is. `open`: something is
 *  open that a key press would close. */
async function pass(
  page: Page,
  key: string,
  mode: Mode,
  name: string,
  start: number,
  open = name !== "rest",
  fresh: boolean | "new" = name !== "rest",
): Promise<CensusPage | null> {
  const rest = name === "rest"
  const walked = (await page.evaluate(
    censusSnippet({ kind: "walk", max: Number(args.max), fresh, start }),
  )) as {
    elements: CensusElement[]
    truncated: number
    viewport: CensusPage["viewport"]
    reads: NonNullable<CensusPage["reads"]>
  }
  const { elements } = walked
  if (!rest && !elements.length) return null
  // Before reading states, which hover, scroll and can close what the pass
  // opened: the shot shows the page the boxes were read on. A later pass
  // reads only the viewport (census `fresh`): the shot is the viewport too.
  const shot = SHOTS
    ? await shoot(
        page,
        `${slug(key)}-${createHash("sha1").update(name).digest("hex").slice(0, 8)}-${mode}.jpg`,
        !fresh,
        elements,
      )
    : undefined
  // The most used looks with a box small enough to copy.
  const copied = representatives(elements)
    .filter(
      ({ role, box: [, , w, h] }) =>
        !BOXLESS.has(role) && w * h > 0 && w * h <= COPY_AREA,
    )
    .slice(0, Number(args.copies))
  const copies: Copies = Object.fromEntries(
    Object.entries(
      await freeze(
        page,
        copied.map((element) => element.id),
      ),
    ).map(([id, rest]) => [id, { rest }]),
  )
  COPIES.set(copiesOf(key, name, mode), copies)
  await readStates(
    page,
    representatives(elements, INTERACTIVE).slice(0, Number(args.states)),
    copies,
    !open,
  )
  const { vars, tokens } = (await page.evaluate(
    censusSnippet({
      kind: "vars",
      ids: representatives(elements)
        .slice(0, 400)
        .map((element) => element.id),
    }),
  )) as { vars: Record<string, Values>; tokens: Record<string, string> }
  for (const element of elements) {
    if (vars[element.id]) element.vars = vars[element.id]
    element.values = trim(element.values)
  }
  return {
    key,
    mode,
    probe: PROBE,
    pass: name,
    viewport: walked.viewport,
    elements,
    ...(Object.keys(tokens).length ? { tokens } : {}),
    ...(walked.truncated ? { truncated: walked.truncated } : {}),
    reads: [...walked.reads, "states"],
    ...shot,
  }
}

const markSeen = (page: Page) => page.evaluate(censusSnippet({ kind: "seen" }))
/** Back to the top: reading states scrolls, and some headers hide while the
 *  page is scrolled (America.gov's). */
const top = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, 0))
  await pause(150)
}
const appeared = (page: Page) =>
  page.evaluate(censusSnippet({ kind: "appeared" })) as Promise<number>

/** What opens on a page, found from the page alone, as unique selectors a
 *  fresh load can find again: popup, menu, disclosure and dialog triggers,
 *  or tooltip triggers (what an aria-describedby or a tooltip attribute
 *  points at, then icon-only controls). One per look, so a page of twenty
 *  identical menus opens one. */
const finders = (page: Page, kind: "popups" | "tips", max: number) =>
  page.evaluate(
    (kind, max) => {
      // Ids a framework generates (React's useId, Radix, React Aria) can
      // change between loads.
      const generated =
        /_r[\d_]|^(:|radix-|react-aria|headlessui-|mui-|base-ui-)|[:«»]|\d{3,}/i
      const path = (el: Element): string => {
        if (
          el.id &&
          !generated.test(el.id) &&
          document.querySelectorAll(`#${CSS.escape(el.id)}`).length === 1
        )
          return `#${CSS.escape(el.id)}`
        const parent = el.parentElement
        if (!parent) return el.localName
        const index = [...parent.children]
          .filter((child) => child.localName === el.localName)
          .indexOf(el)
        return `${path(parent)} > ${el.localName}:nth-of-type(${index + 1})`
      }
      const look = (el: Element) => {
        const style = getComputedStyle(el)
        return [
          el.localName,
          el.getAttribute("role") ?? "",
          el.getAttribute("aria-haspopup") ?? "",
          style.backgroundColor,
          style.borderTopWidth,
          style.borderTopLeftRadius,
          style.fontSize,
          Math.round(el.getBoundingClientRect().height),
        ].join("|")
      }
      const all = (selector: string) => [...document.querySelectorAll(selector)]
      let found: Element[]
      if (kind === "popups")
        found = [
          ...all('[aria-haspopup]:not([aria-haspopup="false"])'),
          ...all("[popovertarget], [commandfor]"),
          ...all("details:not([open]) > summary"),
          ...all('[aria-expanded="false"]'),
        ].filter((el) => {
          // A link to another page navigates instead of opening.
          const href = el.localName === "a" ? el.getAttribute("href") : null
          return (
            !href || href.startsWith("#") || el.hasAttribute("aria-haspopup")
          )
        })
      else {
        const tip = (id: string) => {
          const target = id ? document.getElementById(id) : null
          return (
            !!target &&
            (target.getAttribute("role") === "tooltip" ||
              target.hasAttribute("popover") ||
              !target.checkVisibility())
          )
        }
        found = [
          ...all("[aria-describedby], [aria-labelledby]").filter((el) =>
            ["aria-describedby", "aria-labelledby"].some((name) =>
              (el.getAttribute(name) ?? "").split(/\s+/).some(tip),
            ),
          ),
          ...all(
            "[data-tooltip], [data-tip], [data-tippy-content], [data-tooltip-content], [data-tooltip-id]",
          ),
          ...all("button, [role=button], a[href]").filter(
            (el) =>
              !(el.textContent ?? "").trim() && el.querySelector("svg, img"),
          ),
        ]
      }
      const looks = new Set<string>()
      const out = new Set<string>()
      for (const el of found) {
        if (out.size >= max) break
        if (
          !el.checkVisibility() ||
          !el.getBoundingClientRect().width ||
          el.closest("[aria-hidden=true], [inert]")
        )
          continue
        const sig = look(el)
        if (looks.has(sig)) continue
        looks.add(sig)
        out.add(path(el))
      }
      return [...out]
    },
    kind,
    max,
  )

/** The story a Storybook iframe page shows, if it is one. */
const storyOf = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.pathname.endsWith("/iframe.html")
      ? parsed.searchParams.get("id")
      : null
  } catch {
    return null
  }
}

type StoryArgs = {
  args: Record<string, unknown>
  types: {
    name: string
    options?: unknown[]
    control?: string | false
    off: boolean
    type?: string
  }[]
}

/** A story's initial args and argTypes, from the store Storybook keeps. */
const storyArgs = (page: Page, story: string): Promise<StoryArgs | null> =>
  page
    .evaluate(async (story) => {
      const store = (
        window as unknown as {
          __STORYBOOK_PREVIEW__?: {
            storyStoreValue?: {
              loadStory: (input: { storyId: string }) => Promise<{
                initialArgs?: Record<string, unknown>
                argTypes?: Record<
                  string,
                  {
                    options?: unknown[]
                    control?:
                      | false
                      | string
                      | { type?: string; disable?: boolean }
                    table?: { disable?: boolean }
                    type?: { name?: string }
                  }
                >
              }>
            }
          }
        }
      ).__STORYBOOK_PREVIEW__?.storyStoreValue
      if (!store) return null
      const loaded = await store.loadStory({ storyId: story })
      return {
        args: loaded.initialArgs ?? {},
        types: Object.entries(loaded.argTypes ?? {}).map(([name, t]) => ({
          name,
          options: Array.isArray(t.options) ? t.options : undefined,
          control: typeof t.control === "object" ? t.control?.type : t.control,
          off:
            t.control === false ||
            (typeof t.control === "object" && !!t.control?.disable) ||
            !!t.table?.disable,
          type: t.type?.name,
        })),
      }
    }, story)
    .catch(() => null)

/* An arg with options to pick from: a variant, a size, a tone. */
const isEnum = (t: StoryArgs["types"][number]) =>
  !t.off &&
  t.type !== "object" &&
  t.type !== "function" &&
  !!t.options &&
  t.options.length <= 12 &&
  t.options.every((o) => typeof o === "string" || typeof o === "number")

/** The enum args a story renders with, as names: only values from its
 *  options, never free text (a label, children). */
const enumArgs = (found: StoryArgs, args: Record<string, unknown>) =>
  Object.fromEntries(
    found.types.filter(isEnum).flatMap((t) => {
      const value = args[t.name]
      return (typeof value === "string" || typeof value === "number") &&
        t.options?.includes(value) &&
        String(value).length <= 40
        ? [[t.name, String(value)]]
        : []
    }),
  )

/* Variant and size args first, so --args reaches them first. Names that
   only contain variant or size go last: responsive copies (variantAtNarrow)
   and a part's size (leadingVisualSize) redraw what the plain ones do, or
   a part, not the component. */
const rankOf = (arg: string) =>
  /^(variant|size|appearance|kind|tone|intent|emphasis|color|shape)$/i.test(arg)
    ? 0
    : /variant|size/i.test(arg)
      ? 2
      : 1

/** A story's variants, one arg changed at a time: each option of its enum
 *  args (variant, size, tone…) and the other value of its boolean ones
 *  (disabled, loading, invalid…). Args that take components or functions
 *  (icons, slots) are left out. */
function variants(found: StoryArgs, max: number) {
  const options: Record<string, unknown>[] = []
  const toggles: Record<string, unknown>[] = []
  const types = [...found.types].sort((a, b) => rankOf(a.name) - rankOf(b.name))
  for (const t of types) {
    if (t.off || t.type === "object" || t.type === "function") continue
    if (isEnum(t) && t.options) {
      for (const option of t.options)
        if (option !== found.args[t.name]) options.push({ [t.name]: option })
    } else if (t.type === "boolean" || t.control === "boolean")
      toggles.push({ [t.name]: !found.args[t.name] })
  }
  return [...options, ...toggles].slice(0, max)
}

/** Sets a story's args in place, or resets them (null), and waits for it to
 *  render again. */
const setArgs = (
  page: Page,
  story: string,
  updated: Record<string, unknown> | null,
) =>
  page.evaluate(
    (story, updated) =>
      new Promise<boolean>((done) => {
        const channel = (
          window as unknown as {
            __STORYBOOK_PREVIEW__?: {
              channel?: {
                on: (name: string, fn: () => void) => void
                off: (name: string, fn: () => void) => void
                emit: (name: string, payload: unknown) => void
              }
            }
          }
        ).__STORYBOOK_PREVIEW__?.channel
        if (!channel) return done(false)
        const rendered = () => {
          channel.off("storyRendered", rendered)
          done(true)
        }
        channel.on("storyRendered", rendered)
        setTimeout(() => {
          channel.off("storyRendered", rendered)
          done(false)
        }, 3000)
        channel.emit(
          updated ? "updateStoryArgs" : "resetStoryArgs",
          updated
            ? { storyId: story, updatedArgs: updated }
            : { storyId: story },
        )
      }),
    story,
    updated,
  )

interface Job {
  key: string
  url: string
  mode: Mode
  settings: Omit<PackPage, "parts">
  passes: Step[][]
  /** One story among its component's many: read at rest and in its states,
   *  with no popups, tooltips or args passes. */
  lite?: boolean
}

/* Taller pages are cut: a shot is for finding a look, not reading the
   page. */
const SHOT_HEIGHT = 10000

/** A shot of the page as it stands, in <out>/shots/: its path from <out>,
 *  and where on the page it starts when not at the top; undefined when the
 *  page can't be shot. `whole`: the whole page, unless scrolled; else the
 *  viewport. A whole shot grows the viewport to the page's height and waits
 *  for the page to paint it (an app that re-renders on resize, Airbnb's,
 *  shot mid-render is blank), so what is fixed or sticky moves away from
 *  where its box was read, some tooltips close, and content that loads or
 *  sizes to the viewport moves what follows: `shotBoxes` holds where the
 *  `elements` that moved sit on the shot. */
async function shoot(
  page: Page,
  file: string,
  whole: boolean,
  elements: CensusElement[],
) {
  const viewport = page.viewport() ?? { width: 1440, height: 900 }
  let grown = false
  let moved: Record<number, CensusElement["box"]> = {}
  try {
    // The body's height too: a body that scrolls on its own, or one a
    // notice holds fixed (Airbnb's), holds the page.
    const { x, y, height } = await page.evaluate(() => ({
      x: scrollX,
      y: scrollY,
      height: Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
      ),
    }))
    const at: [number, number] | null =
      x || y ? [Math.round(x), Math.round(y)] : null
    if (whole && !at && height > viewport.height) {
      await page.setViewport({
        ...viewport,
        height: Math.min(height, SHOT_HEIGHT),
      })
      grown = true
      await page
        .waitForNetworkIdle({ idleTime: 500, timeout: 4000 })
        .catch(() => {})
      await settle(page)
      // A framed field's box is its frame's, as the census read it.
      const boxes = (await page.evaluate(() => {
        const boxOf = (el: Element) => {
          const { x, y, width, height } = el.getBoundingClientRect()
          return [x, y, width, height].map(Math.round)
        }
        const by = (attribute: string) =>
          [...document.querySelectorAll(`[${attribute}]`)].map((el) => [
            el.getAttribute(attribute),
            boxOf(el),
          ])
        return Object.fromEntries([
          ...by("data-census"),
          ...by("data-census-frame"),
        ])
      })) as Record<string, CensusElement["box"]>
      moved = Object.fromEntries(
        elements.flatMap(({ id, box }) => {
          const now = boxes[id]
          return now && now.some((value, i) => Math.abs(value - box[i]!) > 1)
            ? [[id, now]]
            : []
        }),
      )
    }
    const shot = await page.screenshot({ type: "jpeg", quality: 60 })
    await mkdir(resolve(OUT, "shots"), { recursive: true })
    await writeFile(resolve(OUT, "shots", file), shot)
    return {
      shot: `shots/${file}`,
      ...(at ? { shotAt: at } : {}),
      ...(Object.keys(moved).length ? { shotBoxes: moved } : {}),
    }
  } catch {
    return undefined
  } finally {
    if (grown) {
      await page.setViewport(viewport).catch(() => {})
      await settle(page)
    }
  }
}

/** A file name for a page key: readable, with a hash of the whole key so
 *  long keys that share a start (Storybook story URLs) stay apart. */
const slug = (key: string) =>
  `${key
    .replace(/^[a-z]+:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)}-${createHash("sha1").update(key).digest("hex").slice(0, 8)}`

/** Every pass of one page in one mode: at rest; then in place, each popup
 *  and tooltip found and each variant of a story; then on a fresh load
 *  each, the pack's passes. */
async function crawl(
  job: Job,
  open: (job: Job) => Promise<{
    page: Page
    load: () => Promise<void>
    close: () => Promise<void>
  }>,
) {
  const { page, load, close } = await open(job)
  const pages: CensusPage[] = []
  let start = 0
  // A story's enum args as the pass renders them.
  let rendered: Record<string, string> = {}
  const keep = (censusPage: CensusPage | null) => {
    if (!censusPage) return
    pages.push({
      ...censusPage,
      ...(Object.keys(rendered).length ? { args: rendered } : {}),
    })
  }
  const warn = (name: string, error: unknown) =>
    console.warn(
      `${job.key} (${job.mode}) pass "${name}": ${(error as Error).message}`,
    )
  // Where a load lands, without its hash: a pass that leaves it navigated.
  const where = () => {
    const url = new URL(page.url())
    return url.origin + url.pathname + url.search
  }
  try {
    page.on("dialog", (dialog) => void dialog.dismiss())
    await load()
    const home = where()
    const story = storyOf(job.url)
    const found = story ? await storyArgs(page, story) : null
    const initial = found ? enumArgs(found, found.args) : {}
    rendered = initial
    await top(page)
    keep(await pass(page, job.key, job.mode, "rest", 0))
    const popups = OPEN && !job.lite ? await finders(page, "popups", OPEN) : []
    const tips =
      Number(args.tips) && !job.lite
        ? await finders(page, "tips", Number(args.tips))
        : []
    const listed = new Set(job.passes.map((steps) => steps.map(say).join("; ")))
    // Popups open in place too: Escape closes most, and one that leaves
    // something open (a disclosure) or navigates reloads the page.
    let dirty = false
    for (const selector of popups) {
      const name = `click ${selector}`
      if (listed.has(name)) continue
      try {
        if (dirty) await load()
        dirty = false
        await top(page)
        await markSeen(page)
        await runSteps(page, [{ click: selector }])
        // The click leaves the pointer on the trigger, whose open look
        // would read hovered.
        await page.mouse.move(0, 0)
        await pause(400)
        await finish(page)
        // A trigger that navigates opened nothing.
        if (where() === home)
          keep(await pass(page, job.key, job.mode, name, (start += 100000)))
      } catch (error) {
        warn(name, error)
        dirty = true
      } finally {
        await page.keyboard.press("Escape").catch(() => {})
        await pause(300)
        dirty ||= where() !== home || (await appeared(page).catch(() => 1)) > 0
      }
    }
    if (dirty) await load()
    for (const selector of tips) {
      let name = `hover ${selector}`
      try {
        await top(page)
        await markSeen(page)
        await page.hover(selector)
        await pause(900)
        if (!(await appeared(page))) {
          // React Aria and Primer tooltips open on keyboard focus.
          name = `focus ${selector}`
          await page.mouse.move(0, 0)
          await page.focus(selector)
          await page.keyboard.press("Tab")
          await page.keyboard.down("Shift")
          await page.keyboard.press("Tab")
          await page.keyboard.up("Shift")
          await pause(900)
        }
        if (await appeared(page)) {
          await finish(page)
          keep(
            await pass(
              page,
              job.key,
              job.mode,
              name,
              (start += 100000),
              true,
              "new",
            ),
          )
        }
      } catch (error) {
        warn(name, error)
      } finally {
        await page.mouse.move(0, 0).catch(() => {})
        await page
          .evaluate(() =>
            (document.activeElement as HTMLElement | null)?.blur?.(),
          )
          .catch(() => {})
        await page.keyboard.press("Escape").catch(() => {})
        await pause(200)
      }
      if (where() !== home) await load()
    }
    for (const updated of found && Number(args.args) && !job.lite
      ? variants(found, Number(args.args))
      : []) {
      const name = `args ${Object.entries(updated)
        .map(([arg, value]) => `${arg}:${value}`)
        .join(",")}`
      try {
        await markSeen(page)
        // No render in time: a late one would land mid-walk.
        if (await setArgs(page, story as string, updated)) {
          await pause(200)
          await finish(page)
          rendered = found ? enumArgs(found, { ...found.args, ...updated }) : {}
          keep(
            await pass(page, job.key, job.mode, name, (start += 100000), false),
          )
        }
      } catch (error) {
        warn(name, error)
      } finally {
        rendered = initial
      }
      await page.mouse.move(0, 0).catch(() => {})
      // A story still re-rendering would read into the next variant.
      if (!(await setArgs(page, story as string, null).catch(() => false)))
        break
    }
    for (const steps of job.passes) {
      const name = steps.map(say).join("; ")
      try {
        await load()
        await markSeen(page)
        await runSteps(page, steps)
        // A click leaves the pointer on the trigger, whose open look would
        // read hovered.
        if (!steps.some((step) => "hover" in step)) await page.mouse.move(0, 0)
        await pause(400)
        await finish(page)
        keep(await pass(page, job.key, job.mode, name, (start += 100000)))
      } catch (error) {
        warn(name, error)
      }
    }
  } catch (error) {
    console.warn(`${job.key} (${job.mode}): ${(error as Error).message}`)
  } finally {
    await close()
  }
  for (const [i, censusPage] of pages.entries()) {
    const file = resolve(OUT, "pages", `${slug(job.key)}-${i}-${job.mode}`)
    await writeFile(`${file}.json`, `${JSON.stringify(censusPage)}\n`)
    const copies = COPIES.get(copiesOf(job.key, censusPage.pass, job.mode))
    if (copies && Object.keys(copies).length)
      await writeFile(
        `${file}.copies.json`,
        `${JSON.stringify({ key: job.key, pass: censusPage.pass, mode: job.mode, copies })}\n`,
      )
  }
  const count = pages.reduce((sum, p) => sum + p.elements.length, 0)
  console.log(
    `${job.key} (${job.mode}): ${pages.length} pass${pages.length === 1 ? "" : "es"}, ${count} elements`,
  )
  return pages
}

/** Same-site links from the start pages, for --follow. */
async function discover(browser: Browser, jobs: Job[], max: number) {
  const known = new Set(jobs.map((job) => job.url))
  const found: Job[] = []
  for (const job of jobs.filter((job) => job.mode === MODES[0])) {
    if (found.length >= max) break
    const { page, load, close } = await openPage(
      browser,
      job.url,
      job.mode,
      job.settings,
    )
    try {
      await load()
      const origin = new URL(job.url).origin
      const links = await page.$$eval("a[href]", (anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).href),
      )
      for (const link of links) {
        const url = new URL(link)
        url.hash = ""
        if (url.origin !== origin || known.has(url.href) || found.length >= max)
          continue
        if (
          /\.(pdf|zip|png|jpe?g|svg|mp4)$/i.test(url.pathname) ||
          /log-?out|sign-?out/i.test(url.pathname)
        )
          continue
        known.add(url.href)
        for (const mode of MODES)
          found.push({
            key: url.href,
            url: url.href,
            mode,
            settings: { ...job.settings, steps: [] },
            passes: [],
          })
      }
    } catch (error) {
      console.warn(`${job.url}: ${(error as Error).message}`)
    } finally {
      await close()
    }
  }
  return found
}

/** For --stories: every story of each component the pack's pages read in a
 *  Storybook, and of up to `max` more of its components, from the
 *  Storybook's index.json. A new component's Playground story (else its
 *  Default one) is read in full, every other story `lite`: a story shows
 *  one feature (a size, a variant) its args name. They take the globals,
 *  dark URL and settings of the pack's first story there. */
async function moreStories(browser: Browser, jobs: Job[], max: number) {
  if (!max) return []
  const roots = new Map<string, Job[]>()
  for (const job of jobs) {
    if (!storyOf(job.url)) continue
    const root = new URL("index.json", job.url).href
    roots.set(root, [...(roots.get(root) ?? []), job])
  }
  type Entry = { id: string; title: string; name: string; type?: string }
  const swap = (url: string, id: string) =>
    url.replace(/([?&]id=)[^&#]*/, `$1${id}`)
  const found: Job[] = []
  for (const [root, list] of roots) {
    const [first] = list
    if (!first) continue
    const { page, load, close } = await openPage(
      browser,
      first.url,
      first.mode,
      first.settings,
    )
    try {
      await load()
      const index = (await page.evaluate(
        (root) => fetch(root).then((response) => response.json()),
        root,
      )) as { entries?: Record<string, Entry>; stories?: Record<string, Entry> }
      const entries = Object.values(
        index.entries ?? index.stories ?? {},
      ).filter((entry) => (entry.type ?? "story") === "story")
      const component = (title: string) =>
        title.split("/").slice(0, 2).join("/")
      const have = new Set(
        list.flatMap((job) => {
          const entry = entries.find((e) => e.id === storyOf(job.url))
          return entry ? [component(entry.title)] : []
        }),
      )
      const rank = (entry: Entry) =>
        /^playground$/i.test(entry.name)
          ? 0
          : /^default$/i.test(entry.name)
            ? 1
            : 2
      const byComponent = new Map<string, Entry[]>()
      for (const entry of entries) {
        if (
          /deprecated|private|internal|hooks?\b|utilit|\btests?\b/i.test(
            entry.title,
          )
        )
          continue
        const name = component(entry.title)
        byComponent.set(name, [...(byComponent.get(name) ?? []), entry])
      }
      const more = [...byComponent.keys()]
        .filter((name) => !have.has(name))
        .slice(0, max)
      const taken = new Set(list.map((job) => storyOf(job.url)))
      const templates = list.filter((job) => job.key === first.key)
      let walked = 0
      for (const name of [...have, ...more]) {
        const stories = byComponent.get(name) ?? []
        const lead = have.has(name)
          ? undefined
          : [...stories].sort((a, b) => rank(a) - rank(b))[0]
        for (const entry of stories) {
          if (taken.has(entry.id)) continue
          walked++
          for (const job of templates)
            found.push({
              ...job,
              key: swap(job.key, entry.id),
              url: swap(job.url, entry.id),
              passes: [],
              ...(entry === lead ? {} : { lite: true }),
            })
        }
      }
      console.log(
        `${root}: ${walked} more stories of ${have.size + more.length} of ${byComponent.size} components`,
      )
    } catch (error) {
      console.warn(`${root}: ${(error as Error).message}`)
    } finally {
      await close()
    }
  }
  return found
}

async function headless(): Promise<CensusPage[]> {
  const packFile = resolve(REFS, pack, "targets.json")
  const targets: Record<string, PackPage> = existsSync(packFile)
    ? await readJson(packFile)
    : {}
  const folder = pathToFileURL(`${resolve(REFS, pack)}/`)
  const jobs: Job[] = []
  for (const [
    key,
    { parts, signedIn, mode, dark, ...settings },
  ] of Object.entries(targets)) {
    if (signedIn || (args.url.length && !args.url.includes(key))) continue
    const passes = [
      ...new Map(
        [
          ...Object.values(parts).flatMap((target) =>
            target.before?.length ? [target.before] : [],
          ),
          ...(settings.passes ?? []),
        ].map((steps) => [JSON.stringify(steps), steps]),
      ).values(),
    ]
    const url = new URL(key, folder).href
    const modes = dark ? (["light", "dark"] as Mode[]) : mode ? [mode] : MODES
    for (const m of modes.filter((m) => MODES.includes(m)))
      jobs.push({
        key,
        url: m === "dark" && dark ? new URL(dark, folder).href : url,
        mode: m,
        settings,
        passes,
      })
  }
  for (const url of args.url.filter((url) => !targets[url]))
    for (const mode of MODES)
      jobs.push({ key: url, url, mode, settings: {}, passes: [] })
  if (!jobs.length) {
    console.error(
      `${pack}: no public pages in targets.json; pass --url, or --connect for signed-in pages`,
    )
    process.exit(1)
  }
  const browser = await launch()
  try {
    jobs.push(...(await discover(browser, jobs, Number(args.follow))))
    jobs.push(...(await moreStories(browser, jobs, Number(args.stories))))
    const open = (job: Job) =>
      openPage(browser, job.url, job.mode, job.settings)
    return (
      await pool(jobs, (job) => crawl(job, open), Number(args.concurrency))
    ).flat()
  } finally {
    await browser.close()
  }
}

/* Signed in: new tabs in the person's own Chrome (their cookies), one at a
   time, closed after; nothing in the profile is changed. */
async function connected(): Promise<CensusPage[]> {
  if (!args.pages) {
    console.error(
      '--connect needs --pages <file>: { "<page key>": "<real url>" }',
    )
    process.exit(1)
  }
  const urls: Record<string, string> = await readJson(resolve(args.pages))
  const targets: Record<string, PackPage> = existsSync(
    resolve(REFS, pack, "targets.json"),
  )
    ? await readJson(resolve(REFS, pack, "targets.json"))
    : {}
  const port = args.connect as string
  const browser = await puppeteer.connect({
    browserURL: /^\d+$/.test(port) ? `http://127.0.0.1:${port}` : port,
    defaultViewport: null,
  })
  const open = async (job: Job) => {
    const page = await browser.newPage()
    await shim(page)
    await page.setViewport({ width: job.settings.width ?? 1440, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: job.mode },
    ])
    await focusable(page)
    const load = async () => {
      await page.goto(job.url, { waitUntil: "load", timeout: 60000 })
      await page
        .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
        .catch(() => {})
      await pause(job.settings.settle ?? 2500)
      await runSteps(page, job.settings.steps ?? [])
    }
    return { page, load, close: () => page.close() }
  }
  try {
    const pages: CensusPage[] = []
    for (const [key, url] of Object.entries(urls))
      for (const mode of MODES) {
        const known = targets[key]
        const passes = args.passes
          ? [
              ...Object.values(known?.parts ?? {}).flatMap((target) =>
                target.before?.length ? [target.before] : [],
              ),
              ...(known?.passes ?? []),
            ]
          : []
        pages.push(
          ...(await crawl(
            {
              key,
              url,
              mode,
              settings: {
                settle: known?.settle,
                steps: args.passes ? known?.steps : [],
                width: known?.width,
              },
              passes,
            },
            open,
          )),
        )
      }
    return pages
  } finally {
    await browser.disconnect()
  }
}

async function saved(dir: string): Promise<CensusPage[]> {
  const folder = existsSync(resolve(dir, "pages"))
    ? resolve(dir, "pages")
    : resolve(dir)
  const files = await readdir(folder)
  for (const file of files.filter((file) => file.endsWith(".copies.json"))) {
    const { key, pass, mode, copies } = await readJson<{
      key: string
      pass: string
      mode: Mode
      copies: Copies
    }>(resolve(folder, file))
    COPIES.set(copiesOf(key, pass, mode), copies)
  }
  return Promise.all(
    files
      .filter(
        (file) => file.endsWith(".json") && !file.endsWith(".copies.json"),
      )
      .map((file) => readJson<CensusPage>(resolve(folder, file))),
  )
}

/** A copy as a page of its own, on the color it sat on, its fonts loaded
 *  from where the product serves them. */
const documentOf = (copy: Snapshot) => {
  const faces = copy.fonts
    .map(
      (font) =>
        `@font-face{font-family:${JSON.stringify(font.family)};src:${font.src}${font.weight ? `;font-weight:${font.weight}` : ""}${font.style ? `;font-style:${font.style}` : ""}${font.unicodeRange ? `;unicode-range:${font.unicodeRange}` : ""}}`,
    )
    .join("\n")
  const css = `${faces}\nbody{margin:0;padding:16px;background:${copy.backdrop}}\n${copy.css}`
  // A "<" in the CSS would close the style element.
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css.replace(/</g, "\\3c ")}</style></head><body>${copy.html}</body></html>\n`
}

/** Each look's copies as part files:
 *  crops/<look>-<state>-<mode>.json, with a standalone .html beside. An
 *  earlier run's are removed first: look ids move between runs. */
async function writeCopies(inventory: Inventory) {
  const dir = resolve(OUT, "crops")
  await rm(dir, { recursive: true, force: true })
  let written = 0
  for (const look of inventory.looks) {
    const { key, pass, mode, id, twin } = look.sample
    const sides: [Mode, number | undefined][] = [
      [mode, id],
      ["dark", mode === "light" ? twin : undefined],
    ]
    for (const [side, element] of sides) {
      const copies =
        element === undefined
          ? undefined
          : COPIES.get(copiesOf(key, pass, side))?.[element]
      for (const [state, snapshot] of Object.entries(copies ?? {})) {
        if (!snapshot) continue
        const part = `${look.id}-${state}`
        const file: PartFile = {
          kind: "dotui-part",
          part,
          mode: side,
          page: key,
          dpr: 1,
          snapshot,
        }
        if (!written++) await mkdir(dir, { recursive: true })
        await writeFile(
          resolve(dir, `${part}-${side}.json`),
          `${JSON.stringify(file)}\n`,
        )
        await writeFile(
          resolve(dir, `${part}-${side}.html`),
          documentOf(snapshot),
        )
      }
    }
  }
  if (written) console.log(`copies → ${dir} (${written})`)
}

await mkdir(resolve(OUT, "pages"), { recursive: true })
const pages = args.from.length
  ? (await Promise.all(args.from.map(saved))).flat()
  : args.connect
    ? await connected()
    : await headless()
const inventory: Inventory = cluster(
  pages,
  PROBE,
  (page, element) =>
    !!COPIES.get(copiesOf(page.key, page.pass, page.mode))?.[element.id]?.rest,
)
await writeFile(
  resolve(OUT, "census.json"),
  `${JSON.stringify({ census: CENSUS, ...inventory }, null, 1)}\n`,
)
console.log(
  `census → ${resolve(OUT, "census.json")} (${inventory.looks.length} looks, ${pages.length} passes, census ${CENSUS})`,
)
await writeCopies(inventory)

const model = buildModel(inventory)
if (args.drift) {
  if (!existsSync(modelFile)) {
    console.error(
      `no committed model at ${modelFile}: run without --drift first`,
    )
    process.exit(1)
  }
  const before: Model = await readJson(modelFile)
  const changes = diffModels(before, model)
  console.log(
    changes.length
      ? `\n## Drift since the committed model\n\n${changes.map((c) => `- ${c}`).join("\n")}`
      : "\nNo drift.",
  )
  process.exit(0)
}
await writeFile(modelFile, `${jsonLines(model)}\n`)
console.log(`model → ${modelFile}\n`)
console.log(summarize(model))
