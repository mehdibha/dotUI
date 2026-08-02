'use client'

/* Shared chrome for every /internal page: breadcrumbs back up the tree, then
   the page's own title and description. Keeps the labs navigable instead of
   being URLs you have to already know.

   Two entry points, same header: `InternalShell` wraps a page that wants the
   standard layout; `InternalHeader` drops the header alone into pages that
   bring their own canvas (the color/preset benches deliberately sit on a
   neutral, un-themed background so they don't bias what they measure). */

import { cn } from '@/registry/lib/utils'
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from '@/registry/ui/breadcrumbs'

export interface Crumb {
  label: string
  /** Omit on the current page — the last crumb isn't a link. */
  href?: string
}

export function InternalHeader({
  crumbs,
  title,
  description,
  actions,
  className,
}: {
  /** Trail below "Internal", which is always prepended. */
  crumbs: Crumb[]
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  // On /internal itself there's nothing below it, so the root crumb is the
  // current page and shouldn't link to where you already are.
  const trail: Crumb[] = [
    { label: 'Internal', href: crumbs.length > 0 ? '/internal' : undefined },
    ...crumbs,
  ]
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Breadcrumbs>
        {trail.map((crumb, i) => (
          <BreadcrumbItem key={`${crumb.label}-${i}`}>
            <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
            {i < trail.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <div className="flex items-start justify-between gap-6">
        <div className="flex max-w-xl flex-col gap-1.5">
          <h1 className="text-lg font-semibold text-fg">{title}</h1>
          {description && (
            <p className="text-sm text-pretty text-fg-muted">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}

export function InternalShell({
  crumbs,
  title,
  description,
  actions,
  children,
}: {
  crumbs: Crumb[]
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col gap-8 px-8 py-10">
      <InternalHeader
        crumbs={crumbs}
        title={title}
        description={description}
        actions={actions}
      />
      {children}
    </div>
  )
}
