"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import type { Snapshot, SnapshotFont } from "@dotui/capture/snapshot"

/* A frozen copy of the real product's element: its DOM with every computed
   style inlined, drawn in a shadow root. A system's copies come one file per
   census date (scripts/copies.ts): from www/.scratch-refs in dev, from the
   Blob store `copies:upload` fills once deployed. */

const COPIES = import.meta.env.DEV ? "/copies" : undefined

const files = new Map<string, Promise<Record<string, Snapshot> | null>>()

/** A copy path starts with its census date, which names its file. */
function copiesOf(slug: string, path: string) {
  if (!COPIES) return undefined
  const url = `${COPIES}/${slug}/${path.split("/")[0]}.json`
  let file = files.get(url)
  if (!file) {
    file = fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
    files.set(url, file)
  }
  return file
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
  const [ref, seen] = useSeen<HTMLDivElement>()
  const [snapshot, setSnapshot] = useState<Snapshot | null | undefined>()

  useEffect(() => {
    if (!seen) return
    let live = true
    void copiesOf(slug, path)?.then(
      (copies) => live && setSnapshot(copies?.[path] ?? null),
    )
    return () => {
      live = false
    }
  }, [slug, path, seen])

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
          {!COPIES
            ? "Copy not hosted yet"
            : snapshot === null
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
