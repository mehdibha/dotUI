'use client'

/* /internal/panel-lab — the section index: the row vocabulary the panel is
   built from, then every panel version as a live preview. Click a preview to
   open that version full size. */

import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'

import { InternalShell } from '@/modules/internal/shell'

import { DRAFTS, draftUrl } from './drafts'
import { useStaticLab } from './use-lab'
import { PanelFrame } from './variants/panel'
import { PANEL_VERSIONS } from './versions'
import type { PanelVersion } from './versions'

/* The panel is 360×720; the preview window shows it scaled, top-anchored,
   clipped with a fade — enough to recognize the version at a glance. */
const PREVIEW_SCALE = 0.62
const PANEL_W = 360
const PANEL_H = 720

function VersionCard({ version }: { version: PanelVersion }) {
  const lab = useStaticLab()
  return (
    <Link
      to="/internal/panel-lab/$version"
      params={{ version: version.id }}
      className="group/version flex cursor-interactive flex-col gap-3 rounded-2xl border border-border/45 bg-card p-3 focus-reset transition-colors hover:border-border focus-visible:focus-ring"
    >
      <div
        className="relative w-full overflow-hidden rounded-xl bg-bg"
        style={{ height: 340 }}
      >
        {/* Inert: the card is the click target, not the controls inside. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 select-none"
          style={{
            width: PANEL_W,
            height: PANEL_H,
            transform: `translateX(-50%) scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <PanelFrame chapters={version.chapters} lab={lab} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[0.8125rem] font-medium text-fg">
            {version.label}
          </span>
          <ArrowUpRightIcon className="size-3.5 text-fg-muted opacity-0 transition-opacity group-hover/version:opacity-100" />
        </span>
        <span className="text-xs/relaxed text-pretty text-fg-muted">
          {version.summary}
        </span>
      </div>
    </Link>
  )
}

export function PanelLabGallery() {
  return (
    <InternalShell
      crumbs={[{ label: 'Panel Lab' }]}
      title="Panel Lab"
      description="The /create control panel, rebuilt in the row language. Each version is the whole panel — open one to work in it, or compare them here."
    >
      <div className="flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            Foundation
          </h2>
          <Link
            to="/internal/panel-lab/controls"
            className="group/tool flex cursor-interactive flex-col gap-1.5 rounded-xl border border-border/45 bg-card p-4 focus-reset transition-colors hover:bg-muted focus-visible:focus-ring"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[0.8125rem] font-medium text-fg">
                Control Lab
              </span>
              <ArrowUpRightIcon className="size-3.5 text-fg-muted opacity-0 transition-opacity group-hover/tool:opacity-100" />
            </span>
            <span className="text-xs/relaxed text-pretty text-fg-muted">
              The row language every version is built from — each interaction
              model (trigger, slider, toggle, stepper, style grid) as a settings
              row. Not versioned: it's the vocabulary, not a design.
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            Versions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PANEL_VERSIONS.map((version) => (
              <VersionCard key={version.id} version={version} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            Drafts
          </h2>
          <p className="max-w-xl text-xs/relaxed text-pretty text-fg-muted">
            Open PRs reworking a section, none landed yet. Drafts sharing a
            section are competing takes on the same ground, not a sequence —
            pick one, then fold it in as the next version.
          </p>
          <ul className="flex flex-col gap-2">
            {DRAFTS.map((draft) => (
              <li key={draft.pr}>
                <a
                  href={draftUrl(draft.pr)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/draft flex cursor-interactive items-start gap-3 rounded-xl border border-border/45 bg-card p-3 focus-reset transition-colors hover:bg-muted focus-visible:focus-ring"
                >
                  <span className="mt-px shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
                    {draft.section}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[0.8125rem] font-medium text-fg">
                        {draft.title}
                      </span>
                      <span className="font-mono text-xs text-fg-muted">
                        #{draft.pr}
                      </span>
                      <ArrowUpRightIcon className="size-3.5 text-fg-muted opacity-0 transition-opacity group-hover/draft:opacity-100" />
                    </span>
                    <span className="text-xs/relaxed text-pretty text-fg-muted">
                      {draft.summary}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </InternalShell>
  )
}
