/* render: screenshots of the /preview pages, so an agent without a browser
   can look at what it built. The browser lives in ./chrome; everything here
   is pure given a screenshotter. */

import { canonicalPreset, PREVIEW_PAGES, previewUrl, ToolError } from "./tools"

export const RENDER_MODES = ["light", "dark", "both"] as const
type Mode = "light" | "dark"

/** Overview section id → the title its header reads. */
export const OVERVIEW_SECTIONS = {
  color: "Color",
  typography: "Typography",
  iconography: "Iconography",
  shape: "Shape",
  density: "Density & spacing",
  surfaces: "Surfaces & elevation",
  components: "Components",
  interaction: "Interaction",
} as const
export type OverviewSection = keyof typeof OVERVIEW_SECTIONS

export interface RenderInput {
  preset?: string
  page?: string
  mode?: (typeof RENDER_MODES)[number]
  section?: string
}

export interface Shot {
  jpeg: Uint8Array
  /** Where the capture starts and how tall it is, in CSS px. */
  top: number
  height: number
  pageHeight: number
}

export type Screenshotter = (target: {
  url: string
  /** Capture from this overview section's header instead of the page top. */
  section?: string
}) => Promise<Shot>

export function renderPlan(origin: string, input: RenderInput) {
  const page = input.page ?? "overview"
  if (!PREVIEW_PAGES.includes(page))
    throw new ToolError(
      `Unknown page: ${page}. Pages: ${PREVIEW_PAGES.join(", ")}`,
    )
  const section = input.section as OverviewSection | undefined
  if (section && page !== "overview")
    throw new ToolError("`section` applies to the overview page only.")
  if (section && !Object.hasOwn(OVERVIEW_SECTIONS, section))
    throw new ToolError(
      `Unknown section: ${section}. Sections: ${Object.keys(OVERVIEW_SECTIONS).join(", ")}`,
    )
  const preset = canonicalPreset(input.preset)
  const modes: Mode[] =
    !input.mode || input.mode === "both" ? ["light", "dark"] : [input.mode]
  return {
    page,
    section,
    shots: modes.map((mode) => ({
      mode,
      url: previewUrl(origin, preset, page, mode),
      key: renderCacheKey(preset, page, mode, section),
    })),
  }
}

export const renderCacheKey = (
  preset: string,
  page: string,
  mode: Mode,
  section?: string,
) => [preset, page, mode, section ?? ""].join("|")

/** Least recently used first out; holds in-flight renders so concurrent
 *  calls for the same shot share one capture. */
export class Lru<V> {
  #entries = new Map<string, V>()
  constructor(readonly max: number) {}

  get(key: string) {
    const value = this.#entries.get(key)
    if (value === undefined) return undefined
    this.#entries.delete(key)
    this.#entries.set(key, value)
    return value
  }

  set(key: string, value: V) {
    this.#entries.delete(key)
    this.#entries.set(key, value)
    const oldest = this.#entries.keys().next()
    if (this.#entries.size > this.max && !oldest.done)
      this.#entries.delete(oldest.value)
  }

  delete(key: string) {
    this.#entries.delete(key)
  }
}

const cache = new Lru<Promise<Shot>>(50)

const LOOK_FOR = {
  overview:
    "Look for: brand color where you meant it (and nowhere else), readable muted text, distinct surfaces and borders in dark mode, and the component sampler at the bottom.",
  app: "Look for: one clear primary action per area, legible hierarchy and muted text, borders vs surfaces, and density that fits the screen, in both modes.",
}

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
    "base64",
  )
}

export async function render(
  origin: string,
  input: RenderInput,
  shoot: Screenshotter,
  shots: Lru<Promise<Shot>> = cache,
) {
  const plan = renderPlan(origin, input)
  const results = await Promise.all(
    plan.shots.map(async ({ key, url, mode }) => {
      let shot = shots.get(key)
      if (!shot) {
        shot = shoot({
          url,
          section: plan.section && OVERVIEW_SECTIONS[plan.section],
        })
        shots.set(key, shot)
        shot.catch(() => shots.delete(key))
      }
      return { mode, url, ...(await shot) }
    }),
  )
  const cropped = results.some((r) => r.top > 0 || r.height < r.pageHeight)
  return [
    {
      type: "text" as const,
      text: JSON.stringify({
        page: plan.page,
        ...(plan.section ? { section: plan.section } : {}),
        images: results.map(({ mode, url, top, height, pageHeight }) => ({
          mode,
          url,
          capturedPx: [top, top + height],
          pageHeightPx: pageHeight,
        })),
        viewport: "1280px wide, images in the order of `images`",
        ...(cropped && plan.page === "overview"
          ? {
              more: `Cropped. Pass section (${Object.keys(OVERVIEW_SECTIONS).join(", ")}) to see the rest.`,
            }
          : {}),
        lookFor: plan.page === "overview" ? LOOK_FOR.overview : LOOK_FOR.app,
      }),
    },
    ...results.map((shot) => ({
      type: "image" as const,
      data: toBase64(shot.jpeg),
      mimeType: "image/jpeg",
    })),
  ]
}
