// The preview's palette CSS, cached by content; live previews compute it in a
// worker so a color drag doesn't run the color engine on the shared thread.

import { colorKey } from "@/lib/resolve-color"
import { themeCss } from "@/lib/theme-css"
import type { ColorConfig } from "@/registry/theme"

const MAX_ENTRIES = 16

interface Job {
  key: string
  color: ColorConfig
  done: Array<(css: string) => void>
}

const cache = new Map<string, string>()
let worker: Worker | null | undefined
let running: Job | undefined
let queued: Job | undefined

function cached(key: string) {
  const css = cache.get(key)
  if (css !== undefined) {
    cache.delete(key)
    cache.set(key, css)
  }
  return css
}

function remember(key: string, css: string) {
  cache.delete(key)
  cache.set(key, css)
  const oldest = cache.keys().next().value
  if (cache.size > MAX_ENTRIES && oldest !== undefined) cache.delete(oldest)
}

function compute(key: string, color: ColorConfig) {
  const css = themeCss(color)
  remember(key, css)
  return css
}

/** `themeCss(color)`, from the cache or computed now. */
export function themeCssNow(color: ColorConfig): string {
  const key = colorKey(color)
  return cached(key) ?? compute(key, color)
}

function finish(job: Job, css: string) {
  remember(job.key, css)
  for (const done of job.done) done(css)
}

function startWorker() {
  if (typeof Worker === "undefined") return null
  const next = new Worker(new URL("./theme-css.worker.ts", import.meta.url), {
    type: "module",
  })
  next.addEventListener("message", (event: MessageEvent<string>) => {
    const job = running
    running = undefined
    if (job) finish(job, event.data)
    runNext()
  })
  // No worker (failed to load or threw): compute here from now on.
  next.addEventListener("error", () => {
    next.terminate()
    worker = null
    const jobs = [running, queued]
    running = queued = undefined
    for (const job of jobs) if (job) finish(job, themeCss(job.color))
  })
  return next
}

function runNext() {
  running = queued
  queued = undefined
  if (!running) return
  if (worker === undefined) worker = startWorker()
  if (worker) worker.postMessage(running.color)
  else {
    const job = running
    running = undefined
    finish(job, themeCss(job.color))
    runNext()
  }
}

/** `themeCss(color)` for `done`: cached, or shared with the worker job
 *  computing it. Otherwise a live request goes to the worker, one computing
 *  at a time and the newest waiting next (a replaced `done` never runs), and
 *  a commit computes now. */
export function requestThemeCss(
  color: ColorConfig,
  live: boolean,
  done: (css: string) => void,
) {
  const key = colorKey(color)
  const css = cached(key)
  if (css !== undefined) return done(css)
  const pending = [running, queued].find((job) => job?.key === key)
  if (pending) return void pending.done.push(done)
  if (!live) return done(compute(key, color))
  queued = { key, color, done: [done] }
  if (!running) runNext()
}
