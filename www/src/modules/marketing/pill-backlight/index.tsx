import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import { cn } from '@/registry/lib/utils'

import { FRAGMENT_SHADER, VERTEX_SHADER } from './fragment'
import {
  buildStrip,
  LED_COUNT,
  packStrip,
  stadiumParamPx,
  stadiumPointPx,
} from './strip'
import type { Led } from './strip'

// Laps of the pill perimeter per second — a full circuit takes about 11s.
const DRIFT_RATE = 0.09

// Cursor capture, measured from the pill border in canvas-height units: full
// capture inside NEAR, pure drift beyond FAR.
const FOLLOW_NEAR = 0.1
const FOLLOW_FAR = 0.42
// The beam point chases its target in 2D (see draw), not along the perimeter.
const CHASE_STIFFNESS = 12

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
    .createElement('canvas')
    .getContext('2d', { willReadFrequently: true })
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
    console.error('pill-backlight:', gl.getShaderInfoLog(shader))
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
    console.error('pill-backlight:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

/**
 * The CTA pill's light field: an LED strip rides the pill's stadium perimeter
 * behind the DOM, one bright cluster drifts around it and is captured by the
 * cursor when it comes close. The same loop drives the CSS ring glow — it
 * writes `--cta-glow-x/y/boost` on the pill, so the border highlight and the
 * spill always sit on the same point of the perimeter.
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

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const program = createProgram(gl)
    if (!program) return

    gl.useProgram(program)
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uSeed = gl.getUniformLocation(program, 'uSeed')
    const uTint = gl.getUniformLocation(program, 'uTint')
    const uPanel = gl.getUniformLocation(program, 'uPanel')
    const uCluster = gl.getUniformLocation(program, 'uCluster')
    const uLed = gl.getUniformLocation(program, 'uLed')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const packed = new Float32Array(LED_COUNT * 4)
    const cursor = { x: 0, y: 0, active: false }
    let strip: Led[] = []
    let geomKey = ''
    let stillS = 0 // top-centre of the perimeter, the reduced-motion park spot
    let cluster = -1 // parked at stillS once the geometry is first measured
    let sOrbit = -1 // free-drift phase along the perimeter, normalised
    let posX = 0 // rendered beam point (pill border-box px)
    let posY = 0
    let hasPos = false
    let boost = 0 // smoothed cursor pull, also drives the ring brightness
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
      if (sOrbit < 0) sOrbit = stillS

      const pxR = pRect.height / 2
      const pxFlat = Math.max(pRect.width - pRect.height, 0)
      const perimeter = 2 * pxFlat + 2 * Math.PI * pxR

      if (dt > 0) {
        // Cursor pull (1 at the border, 0 at FOLLOW_FAR away) and the border
        // point nearest the cursor, in pill border-box px.
        let pull = 0
        let projX = 0
        let projY = 0
        let hasProj = false
        if (cursor.active) {
          const px = cursor.x - pRect.left
          const py = cursor.y - pRect.top
          const cxq = Math.min(Math.max(px, pxR), pxR + pxFlat)
          const dx = px - cxq
          const dy = py - pxR
          const dist = Math.hypot(dx, dy)
          pull =
            1 -
            smoothstep(FOLLOW_NEAR, FOLLOW_FAR, Math.max(dist - pxR, 0) / unit)
          if (dist > 0) {
            projX = cxq + (dx / dist) * pxR
            projY = pxR + (dy / dist) * pxR
            hasProj = true
          }
        }
        boost += (pull - boost) * (1 - Math.exp(-10 * dt))
        // Positional pull uses the instantaneous distance so a cursor darting
        // away releases the beam immediately; boost keeps the brightness
        // fading smoothly on its own.
        const capture = hasProj ? boost * pull : 0

        // Orbit slows as the cursor takes over; the target blends between the
        // orbit point and the cursor's border point. The beam chases it in
        // 2D, so when the nearest side flips (cursor crossing the pill's
        // centerline) it cuts straight across the interior instead of lapping
        // around a cap.
        sOrbit = wrap(sOrbit + DRIFT_RATE * dt * (1 - capture))
        const [ox, oy] = stadiumPointPx(sOrbit * perimeter, pxR, pxFlat)
        const tx = ox + (projX - ox) * capture
        const ty = oy + (projY - oy) * capture
        if (!hasPos) {
          posX = tx
          posY = ty
          hasPos = true
        } else {
          const k = 1 - Math.exp(-CHASE_STIFFNESS * dt)
          posX += (tx - posX) * k
          posY += (ty - posY) * k
        }
        // The cluster lives on the perimeter: project the beam back onto it.
        // Re-anchoring the orbit there means leaving the cursor resumes the
        // tour from wherever the beam is now.
        cluster = wrap(stadiumParamPx(posX, posY, pxR, pxFlat) / perimeter)
        if (capture > 0.05) sOrbit = cluster

        const kt = 1 - Math.exp(-TINT_STIFFNESS * dt)
        tint = [
          tint[0] + (tintTarget[0] - tint[0]) * kt,
          tint[1] + (tintTarget[1] - tint[1]) * kt,
          tint[2] + (tintTarget[2] - tint[2]) * kt,
        ]
      } else if (!hasPos) {
        ;[posX, posY] = stadiumPointPx(cluster * perimeter, pxR, pxFlat)
        hasPos = true
      }

      syncTint()
      packStrip(strip, cluster, packed)
      gl.uniform2f(uResolution, width, height)
      gl.uniform1f(uSeed, reduced.matches ? 0 : Math.random() * 1000)
      gl.uniform1f(uCluster, cluster)
      gl.uniform3f(uTint, tint[0], tint[1], tint[2])
      gl.uniform4fv(uLed, packed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // The CSS ring glow follows the 2D beam point itself — masked to the
      // border, it dims naturally while the beam crosses the interior.
      pill.style.setProperty('--cta-glow-x', `${posX}px`)
      pill.style.setProperty('--cta-glow-y', `${posY}px`)
      pill.style.setProperty('--cta-glow-boost', boost.toFixed(3))
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

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)

    draw()
    sync()

    return () => {
      pokeRef.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener(
        'pointerleave',
        onPointerLeave,
      )
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
      gl.deleteProgram(program)
      // Deliberately no WEBGL_lose_context here: a lost context sticks to the
      // canvas element, and this effect re-runs on the same element under
      // StrictMode, which would leave the remount drawing into a dead context.
    }
  }, [pillRef])

  // The wrapper takes the inset box; the canvas is a replaced element, so on
  // its own `width: auto` would keep the intrinsic 300×150 instead of filling.
  return (
    <div aria-hidden className={cn('pointer-events-none absolute', className)}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
