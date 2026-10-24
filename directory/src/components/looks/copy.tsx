"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import type { PartFile, Snapshot, SnapshotFont } from "@dotui/capture/snapshot"

/* A frozen copy of the real product's element: its DOM with every computed
   style inlined, drawn in a shadow root. In dev the files come from
   www/.scratch-refs through the dev server (vite.config.ts); a deployed site
   shows a placeholder until the copies have a host. */

const REFS = import.meta.env.DEV ? "/refs" : undefined

export function refUrl(slug: string, path: string) {
  if (!REFS) return undefined
  return `${REFS}/${slug}/${path.split("/").map(encodeURIComponent).join("/")}`
}

export function Copy({
  slug,
  path,
  className,
}: {
  slug: string
  path: string
  className?: string
}) {
  const url = refUrl(slug, path)
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [file, setFile] = useState<PartFile | null | undefined>()

  useEffect(() => {
    if (!url || !seen) return
    let live = true
    fetch(url)
      .then((res) => (res.ok ? (res.json() as Promise<PartFile>) : null))
      .catch(() => null)
      .then((json) => live && setFile(json))
    return () => {
      live = false
    }
  }, [url, seen])

  const snapshot = file?.snapshot
  return (
    <div
      ref={ref}
      className={className}
      style={{ backgroundColor: snapshot?.backdrop }}
    >
      {snapshot ? (
        <Fit snapshot={snapshot} />
      ) : (
        <p className="p-3 text-xs text-fg-muted">
          {!url
            ? "Copy not hosted yet"
            : file === null
              ? "Copy missing"
              : "Loading…"}
        </p>
      )}
    </div>
  )
}

/** The copy at its own size, scaled down when its tile is narrower. */
function Fit({ snapshot }: { snapshot: Snapshot }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const box = ref.current
    if (!box) return
    const fit = () =>
      setScale(Math.min(1, box.clientWidth / Math.max(snapshot.width, 1)))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [snapshot])
  useEffect(() => void loadFonts(snapshot.fonts), [snapshot])

  return (
    <div className="p-4">
      <div ref={ref} style={{ height: snapshot.height * scale }}>
        <ShadowCopy
          snapshot={snapshot}
          style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
        />
      </div>
    </div>
  )
}

function ShadowCopy({
  snapshot,
  style,
}: {
  snapshot: Snapshot
  style: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" })
    // A `<` in the CSS could close the style element: escape it.
    root.innerHTML = `<style>:host{all:initial;display:block}\n${snapshot.css.replace(/</g, "\\3c ")}</style>${snapshot.html}`
  }, [snapshot])
  return (
    <div
      ref={ref}
      className="pointer-events-none"
      style={{ ...style, width: snapshot.width, height: snapshot.height }}
    />
  )
}

const loaded = new Map<string, Promise<boolean>>()

function loadFonts(fonts: SnapshotFont[]) {
  return Promise.all(
    fonts.map((font) => {
      const key = JSON.stringify(font)
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

/** True once the element has come near the viewport: a page holds a few
 *  hundred copies, fetched as they scroll in. */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
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
  }, [seen])
  return [ref, seen] as const
}
