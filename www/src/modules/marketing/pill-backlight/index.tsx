import { useEffect, useRef } from "react"
import type { RefObject } from "react"

import { cn } from "@/registry/lib/utils"

import { FRAGMENT_SHADER, VERTEX_SHADER } from "./fragment"
import {
  buildStrip,
  LED_COUNT,
  packStrip,
  stadiumPointPx,
  WAVE_SPEED,
} from "./strip"
import type { Led } from "./strip"

// Laps of the pill perimeter per second — a full circuit takes about 11s.
const DRIFT_RATE = 0.09

// Hovering the pill trades the travelling cluster for the whole-rim wave
// (see strip.ts): full within the border, gone this far outside it (in
// canvas-height units), eased in time at the given rate. The same blend
// brightens the CSS ring glow.
const HOVER_FADE = 0.06
const HOVER_EASE = 6

// Tint tween toward the preset accent — roughly the ring glow's 700ms ease.
const TINT_STIFFNESS = 5

// Every pixel sums the whole strip, so resolution is the cost driver. At CSS
// pixels the field is already smooth enough that a retina buffer buys nothing.
const MAX_PIXEL_RATIO = 1

const wrap = (x: number) => x - Math.floor(x)

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1)
  return t * t * (3 - 2 * t)
}

type Rgb = [number, number, number]

let probe: CanvasRenderingContext2D | null = null

/** Resolve any CSS color (hex, oklch, …) to linear-ish sRGB via a 1×1 canvas;
 *  `null` resolves to the pill's current text color. */
function parseColor(raw: string | null, el: HTMLElement): Rgb {
  probe ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  if (!probe) return [1, 1, 1]
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = raw ?? getComputedStyle(el).color
  probe.fillRect(0, 0, 1, 1)
  const d = probe.getImageData(0, 0, 1, 1).data
  return [(d[0] ?? 255) / 255, (d[1] ?? 255) / 255, (d[2] ?? 255) / 255]
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("pill-backlight:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext) {
  const vert = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vert || !frag) return null

  const program = gl.createProgram()
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  // The shaders are only referenced by the linked program from here on.
  gl.deleteShader(vert)
  gl.deleteShader(frag)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("pill-backlight:", gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

/**
 * The CTA pill's light field: an LED strip rides the pill's stadium perimeter
 * behind the DOM, one bright cluster drifts around it, and hovering the pill
 * crossfades the cluster into an animated whole-rim glow. The same loop
 * drives the CSS ring glow — it writes `--cta-glow-x/y/boost` on the pill,
 * so the border highlight and the spill always sit on the same point of the
 * perimeter.
 *
 * Purely decorative: the canvas is inert to pointer events and `-z`-stacked
 * behind the pill. Without WebGL2 the ring glow simply stays parked at its
 * CSS defaults, and `prefers-reduced-motion: reduce` renders a single still
 * frame with the cluster parked top-centre.
 */
export function PillBacklight({
  pillRef,
  color,
  className,
}: {
  pillRef: RefObject<HTMLElement | null>
  /** Preset accent (any CSS color); null falls back to the pill's text color. */
  color: string | null
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorRef = useRef(color)
  colorRef.current = color
  const pokeRef = useRef<(() => void) | null>(null)

  // Nudge the running effect when the accent changes: while animating the loop
  // picks the new target up on its own; paused (reduced motion) it snaps.
  useEffect(() => {
    pokeRef.current?.()
  }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    const pill = pillRef.current
    if (!canvas || !pill) return

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    })
    if (!gl) return

    const program = createProgram(gl)
    if (!program) return

    gl.useProgram(program)
    const uResolution = gl.getUniformLocation(program, "uResolution")
    const uSeed = gl.getUniformLocation(program, "uSeed")
    const uTint = gl.getUniformLocation(program, "uTint")
    const uPanel = gl.getUniformLocation(program, "uPanel")
    const uCluster = gl.getUniformLocation(program, "uCluster")
    const uHover = gl.getUniformLocation(program, "uHover")
    const uPhase = gl.getUniformLocation(program, "uPhase")
    const uLed = gl.getUniformLocation(program, "uLed")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const packed = new Float32Array(LED_COUNT * 4)
    const cursor = { x: 0, y: 0, active: false }
    let strip: Led[] = []
    let geomKey = ""
    let stillS = 0 // top-centre of the perimeter, the reduced-motion park spot
    let cluster = -1 // drift phase along the perimeter, parked at stillS
    let hover = 0 // eased whole-rim blend, 1 with the cursor on the pill
    let phase = 0 // hover wave position, in laps
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    let running = false
    let onScreen = true
    let rawTint: string | null | undefined
    let tint: Rgb = [1, 1, 1]
    let tintTarget: Rgb = tint

    const syncTint = () => {
      if (colorRef.current === rawTint) return
      const first = rawTint === undefined
      rawTint = colorRef.current
      tintTarget = parseColor(rawTint, pill)
      if (first) tint = [...tintTarget]
    }

    const draw = (dt = 0) => {
      const cRect = canvas.getBoundingClientRect()
      const pRect = pill.getBoundingClientRect()
      if (!cRect.height || !pRect.height) return

      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      const w = Math.max(1, Math.round(cRect.width * ratio))
      const h = Math.max(1, Math.round(cRect.height * ratio))
      if (w !== width || h !== height) {
        width = w
        height = h
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }

      // Pill geometry in shader space (origin canvas centre, y up, unit =
      // canvas height), rebuilt only when the measured shape actually moves.
      const unit = cRect.height
      const radius = pRect.height / 2 / unit
      const halfFlat = Math.max(pRect.width - pRect.height, 0) / 2 / unit
      const cx =
        (pRect.left + pRect.width / 2 - (cRect.left + cRect.width / 2)) / unit
      const cy =
        -(pRect.top + pRect.height / 2 - (cRect.top + cRect.height / 2)) / unit
      const key = `${radius.toFixed(4)},${halfFlat.toFixed(4)},${cx.toFixed(4)},${cy.toFixed(4)}`
      if (key !== geomKey) {
        geomKey = key
        strip = buildStrip({ cx, cy, halfFlat, radius })
        const flat = 2 * halfFlat
        stillS = flat / 2 / (2 * flat + 2 * Math.PI * radius)
        gl.uniform4f(uPanel, cx, cy, halfFlat, radius)
      }
      if (cluster < 0) cluster = stillS

      const pxR = pRect.height / 2
      const pxFlat = Math.max(pRect.width - pRect.height, 0)
      const perimeter = 2 * pxFlat + 2 * Math.PI * pxR

      if (dt > 0) {
        // Hover: 1 with the cursor on the pill, fading over HOVER_FADE
        // outside the border.
        let onPill = 0
        if (cursor.active) {
          const px = cursor.x - pRect.left
          const py = cursor.y - pRect.top
          const cxq = Math.min(Math.max(px, pxR), pxR + pxFlat)
          const dist = Math.hypot(px - cxq, py - pxR)
          onPill = 1 - smoothstep(0, HOVER_FADE, Math.max(dist - pxR, 0) / unit)
        }
        hover += (onPill - hover) * (1 - Math.exp(-HOVER_EASE * dt))
        phase = wrap(phase + WAVE_SPEED * dt)
        cluster = wrap(cluster + DRIFT_RATE * dt)

        const kt = 1 - Math.exp(-TINT_STIFFNESS * dt)
        tint = [
          tint[0] + (tintTarget[0] - tint[0]) * kt,
          tint[1] + (tintTarget[1] - tint[1]) * kt,
          tint[2] + (tintTarget[2] - tint[2]) * kt,
        ]
      }
      const [posX, posY] = stadiumPointPx(cluster * perimeter, pxR, pxFlat)

      syncTint()
      packStrip(strip, cluster, packed, hover, phase)
      gl.uniform2f(uResolution, width, height)
      gl.uniform1f(uSeed, reduced.matches ? 0 : Math.random() * 1000)
      gl.uniform1f(uCluster, cluster)
      gl.uniform1f(uHover, hover)
      gl.uniform1f(uPhase, phase)
      gl.uniform3f(uTint, tint[0], tint[1], tint[2])
      gl.uniform4fv(uLed, packed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // The CSS ring glow rides the drifting cluster and brightens on hover.
      pill.style.setProperty("--cta-glow-x", `${posX}px`)
      pill.style.setProperty("--cta-glow-y", `${posY}px`)
      pill.style.setProperty("--cta-glow-boost", hover.toFixed(3))
    }

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 15) : 1 / 60
      last = now
      draw(dt)
      frame = requestAnimationFrame(loop)
    }

    const sync = () => {
      const shouldRun = !reduced.matches && onScreen && !document.hidden
      if (shouldRun === running) return
      running = shouldRun
      if (shouldRun) {
        last = 0
        frame = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    pokeRef.current = () => {
      syncTint()
      if (!running) {
        tint = [...tintTarget]
        draw()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (reduced.matches) return
      cursor.x = event.clientX
      cursor.y = event.clientY
      cursor.active = true
    }
    const onPointerLeave = () => {
      cursor.active = false
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!running) draw()
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    intersectionObserver.observe(canvas)

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", sync)
    reduced.addEventListener("change", sync)

    draw()
    sync()

    return () => {
      pokeRef.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      )
      document.removeEventListener("visibilitychange", sync)
      reduced.removeEventListener("change", sync)
      gl.deleteProgram(program)
      // Deliberately no WEBGL_lose_context here: a lost context sticks to the
      // canvas element, and this effect re-runs on the same element under
      // StrictMode, which would leave the remount drawing into a dead context.
    }
  }, [pillRef])

  // The wrapper takes the inset box; the canvas is a replaced element, so on
  // its own `width: auto` would keep the intrinsic 300×150 instead of filling.
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
