'use client'

import {
  BellIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
} from '@/registry/__generated__/icons'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Card, CardContent } from '@/registry/ui/card'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'

const STATS = [
  { label: 'Database size', value: '2.41 GB', delta: '+12.4% this week' },
  { label: 'API requests', value: '184.2K', delta: '+8.1% this week' },
  {
    label: 'Error rate',
    value: '0.42%',
    delta: '+0.18% this week',
    isBad: true,
  },
]

const PROJECTS = [
  {
    name: 'atlas-prod',
    status: 'Active',
    variant: 'success',
    updated: '2m ago',
  },
  {
    name: 'atlas-staging',
    status: 'Pausing',
    variant: 'warning',
    updated: '1h ago',
  },
  {
    name: 'edge-fn-sandbox',
    status: 'Inactive',
    variant: 'neutral',
    updated: '3d ago',
  },
  {
    name: 'metrics-eu',
    status: 'Active',
    variant: 'success',
    updated: '5d ago',
  },
] as const

/**
 * The picker's default scene: a whole product screen in one design system.
 * Nothing here is a swatch grid — every axis reads off real UI, which is how
 * two systems become comparable at a glance (chrome density and control height,
 * field and button style, badge shape, card elevation, the heading face on the
 * app name and page title, the accent on the primary action).
 *
 * Fits the pane without scrolling, and it's the cheapest scene to mount, so
 * it's what the picker opens on. Theming comes from the scope its parent sets.
 */
export function PresetAppScene() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <span
          className="size-5 shrink-0 rounded-(--radius-sm)"
          style={{ background: 'var(--color-accent)' }}
        />
        {/* The mock product's own name — the design system's name belongs to the
            picker's toolbar, and printing it twice read as a bug. */}
        <span className="truncate font-heading text-base font-semibold">
          Atlas
        </span>
        <div className="ml-auto flex items-center gap-2">
          <InputGroup className="w-52">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search projects..." />
          </InputGroup>
          <Button size="sm" isIconOnly aria-label="Notifications">
            <BellIcon />
          </Button>
          <Button size="sm" isIconOnly aria-label="Settings">
            <SettingsIcon />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h3 className="font-heading text-xl leading-none font-semibold">
              Projects
            </h3>
            <span className="text-sm text-fg-muted">3 active</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm">Import</Button>
            <Button variant="primary" size="sm">
              <PlusIcon />
              New project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col gap-1">
                <span className="truncate text-[10px] tracking-widest text-fg-muted uppercase">
                  {stat.label}
                </span>
                <span className="font-heading text-xl leading-none font-semibold tabular-nums">
                  {stat.value}
                </span>
                <span
                  className={
                    stat.isBad
                      ? 'truncate text-xs text-danger'
                      : 'truncate text-xs text-success'
                  }
                >
                  {stat.delta}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-(--radius-lg) border">
          <div className="grid grid-cols-[1fr_auto_5rem] items-center gap-3 border-b px-3 py-2 text-[10px] tracking-widest text-fg-muted uppercase">
            <span>Name</span>
            <span>Status</span>
            <span className="text-right">Updated</span>
          </div>
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="grid grid-cols-[1fr_auto_5rem] items-center gap-3 border-b px-3 py-2.5 text-sm last:border-b-0"
            >
              <span className="flex min-w-0 items-center gap-2">
                <TableIcon className="size-4 shrink-0 text-fg-muted" />
                <span className="truncate">{project.name}</span>
              </span>
              <Badge appearance="subtle" variant={project.variant} size="sm">
                <span aria-hidden className="size-1 rounded-full bg-current" />
                {project.status}
              </Badge>
              <span className="text-right text-xs text-fg-muted">
                {project.updated}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
