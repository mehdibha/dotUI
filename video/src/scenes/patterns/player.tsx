import type { RefObject } from "react"
import { useEffect, useLayoutEffect, useState } from "react"
import { continueRender, delayRender } from "remotion"

/* Bar 4 plays the product the camera lands on: Play is pressed on the
   downbeat, then the playing track steps down the table on the next three
   beats. The block keeps its own state, so every frame drives each copy of
   it (either side of the wave) to where it should be, through its own
   controls — from whatever state this tab last left it in — and holds the
   frame until it gets there. */

export const PLAY = 360
export const STEPS = [390, 420, 450]
const PRESS = 7

type Want = { playing: boolean; row: number; pressed: boolean }

export function playerAt(frame: number): Want {
  return {
    playing: frame >= PLAY,
    row: STEPS.filter((f) => frame >= f).length,
    pressed: frame >= PLAY && frame < PLAY + PRESS,
  }
}

/** One step toward `want`; true once the app shows it. */
function drive(app: Element, want: Want) {
  const rows = [...app.querySelectorAll('[role="row"][aria-selected]')]
  const toggle = app.querySelector<HTMLElement>(
    'footer button[aria-label="Pause"], footer button[aria-label="Play"]',
  )
  const play = [...app.querySelectorAll<HTMLElement>("button")].find(
    (b) => b.textContent?.trim() === "Play",
  )
  // The table's rows mount a render after the block.
  if (rows.length <= want.row || !toggle || !play) return false
  const row = rows.findIndex((r) => r.ariaSelected === "true")
  const playing = toggle.ariaLabel === "Pause"
  // Every press resets the clock, so a fresh tab and a warm one agree.
  const reset = app.querySelector("footer .font-mono")?.textContent === "0:00"
  if (want.playing && (row !== want.row || !playing || !reset)) {
    ;(want.row === 0 ? play : (rows[want.row] as HTMLElement)).click()
    return false
  }
  if (!want.playing && row !== 0) {
    ;(rows[0] as HTMLElement).click()
    return false
  }
  if (!want.playing && playing) {
    toggle.click()
    return false
  }
  play.toggleAttribute("data-pressed", want.pressed)
  return true
}

export function PlayerDriver({
  frame,
  root,
}: {
  frame: number
  root: RefObject<HTMLElement | null>
}) {
  useLayoutEffect(() => {
    const want = playerAt(frame)
    const settled = () =>
      [...(root.current?.querySelectorAll(".pt-screen") ?? [])].every((app) =>
        drive(app, want),
      )
    // Clicks land outside React's commit, one per tick.
    let handle: number | null = null
    let timer: ReturnType<typeof setTimeout> | undefined
    let tries = 0
    const tick = () => {
      if (settled() || ++tries > 100) {
        if (handle !== null) continueRender(handle)
        handle = null
      } else timer = setTimeout(tick, 16)
    }
    handle = delayRender("player state", { timeoutInMilliseconds: 20_000 })
    timer = setTimeout(tick, 0)
    return () => {
      clearTimeout(timer)
      if (handle !== null) continueRender(handle)
    }
  })
  return null
}

/* The block ticks its progress on a one-second wall-clock interval, which
   would make a frame depend on render speed. While the scene is mounted,
   those intervals never start. */
export function useFrozenClock() {
  const [real] = useState(() => {
    const real = window.setInterval
    window.setInterval = ((
      handler: TimerHandler,
      ms?: number,
      ...args: unknown[]
    ) =>
      ms === 1000 ? 0 : real(handler, ms, ...args)) as typeof window.setInterval
    return real
  })
  useEffect(
    () => () => {
      window.setInterval = real
    },
    [real],
  )
}
