import { cn } from '@/lib/utils'

function hostLabel(url: string) {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname === 'github.com') {
      const [org, repo] = pathname.split('/').filter(Boolean)
      return repo ? `${org}/${repo}` : hostname
    }
    return hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface SourceLinksProps {
  sources: string[]
  className?: string
}

/** Compact, deduplicated source chips — the citation trail without the noise. */
export function SourceLinks({ sources, className }: SourceLinksProps) {
  if (sources.length === 0) return null
  const unique = [...new Map(sources.map((url) => [hostLabel(url), url]))]
  return (
    <span
      className={cn('inline-flex flex-wrap items-center gap-1.5', className)}
    >
      {unique.map(([label, url]) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-fg-muted transition-colors hover:bg-muted hover:text-fg"
        >
          {label} ↗
        </a>
      ))}
    </span>
  )
}
