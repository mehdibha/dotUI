import { useEffect, useState } from "react"

import { Skeleton } from "@/registry/ui/skeleton"
import { DynamicPre } from "@/modules/docs/dynamic-pre"

const cache = new Map<string, Promise<string>>()

function fetchSource(url: string) {
  let source = cache.get(url)
  if (!source) {
    source = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${url}`)
        return response.json() as Promise<{ files: { content: string }[] }>
      })
      .then((item) => item.files[0]?.content ?? "")
    source.catch(() => cache.delete(url))
    cache.set(url, source)
  }
  return source
}

/** The published `button.tsx` for the current code style, as users get it. */
export default function ButtonSource({ url }: { url: string }) {
  const [result, setResult] = useState<{ url: string; code?: string }>()

  useEffect(() => {
    let current = true
    fetchSource(url).then(
      (code) => current && setResult({ url, code }),
      () => current && setResult({ url }),
    )
    return () => {
      current = false
    }
  }, [url])

  // Keeps the previous source on screen while the next one loads.
  if (!result) return <Skeleton className="h-80 w-full" />

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <span className="font-mono text-xs text-fg-muted">
        components/ui/button.tsx
      </span>
      {result.code === undefined ? (
        <p className="text-xs text-fg-danger">Couldn't load the preview.</p>
      ) : (
        <div className="max-h-80 min-h-0 flex-1 overflow-auto rounded-md border bg-muted/40">
          <DynamicPre lang="tsx" className="**:[code]:text-xs">
            {result.code}
          </DynamicPre>
        </div>
      )}
    </div>
  )
}
