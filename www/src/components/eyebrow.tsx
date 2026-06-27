import { cn } from '@/registry/lib/utils'

/**
 * The small pill "eyebrow" shown above a page headline — the landing
 * announcement, the /charts hero, and so on. Static by default; wrap it in a
 * link for an interactive one (see the landing's Announcement).
 */
export function Eyebrow({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-fg-muted',
        className,
      )}
      {...props}
    />
  )
}
