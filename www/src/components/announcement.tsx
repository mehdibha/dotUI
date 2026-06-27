import { Link as RouterLink } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Eyebrow } from '@/components/eyebrow'

export function Announcement() {
  return (
    <RouterLink
      to="/create"
      className="group rounded-full focus-reset focus-visible:focus-ring"
    >
      <Eyebrow className="transition-colors group-hover:text-fg">
        <span className="size-1.5 rounded-full bg-accent" />
        <span>
          Open in v0, bolt.new <span className="text-fg-muted/70">&</span>{' '}
          Lovable
        </span>
        <ArrowRightIcon className="size-3 shrink-0" />
      </Eyebrow>
    </RouterLink>
  )
}
