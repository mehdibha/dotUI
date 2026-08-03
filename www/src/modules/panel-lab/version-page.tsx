"use client"

/* One version of the panel, full size and live, on the internal shell. */

import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"

import { InternalShell } from "@/modules/internal/shell"

import { draftChapters, draftUrl } from "./drafts"
import type { Draft } from "./drafts"
import { useLab } from "./use-lab"
import { PanelFrame } from "./variants/panel"
import { PANEL_VERSIONS } from "./versions"
import type { PanelVersion } from "./versions"

export function PanelVersionPage({ version }: { version: PanelVersion }) {
  const lab = useLab()

  return (
    <InternalShell
      crumbs={[
        { label: "Panel Lab", href: "/internal/panel-lab" },
        { label: version.label },
      ]}
      title={`Panel ${version.label}`}
      description={version.summary}
      actions={
        <div className="flex items-center gap-1.5">
          {PANEL_VERSIONS.map((entry) => (
            <Link
              key={entry.id}
              to="/internal/panel-lab/$version"
              params={{ version: entry.id }}
              aria-current={entry.id === version.id ? "page" : undefined}
              className="rounded-lg px-2.5 py-1 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring aria-[current=page]:bg-muted aria-[current=page]:text-fg"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      }
    >
      {/* The real panel sits on the page bg — no card chrome around it. */}
      <div className="flex h-[720px] w-[360px] shrink-0 flex-col">
        <PanelFrame chapters={version.chapters} lab={lab} />
      </div>
    </InternalShell>
  )
}

/** A draft's panel: the newest version with the draft's chapters swapped in. */
export function PanelDraftPage({ draft }: { draft: Draft }) {
  const lab = useLab()
  const base = PANEL_VERSIONS[PANEL_VERSIONS.length - 1]
  if (!base) return null
  const chapters = draftChapters(base.chapters, draft)
  const Frame = draft.Frame ?? PanelFrame

  return (
    <InternalShell
      crumbs={[
        { label: "Panel Lab", href: "/internal/panel-lab" },
        { label: `#${draft.pr}` },
      ]}
      title={draft.title}
      description={draft.summary}
      actions={
        <a
          href={draftUrl(draft.pr)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
        >
          PR #{draft.pr}
          <ArrowUpRightIcon className="size-3.5" />
        </a>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="max-w-lg text-xs/relaxed text-pretty text-fg-muted">
          An open draft, shown on top of{" "}
          <span className="text-fg">{base.label}</span> —{" "}
          {draft.Frame
            ? "only the frame differs; hover a control."
            : `only the ${draft.section} section differs.`}{" "}
          Not merged; one of several takes.
        </p>
        <div className="flex h-[720px] w-[360px] shrink-0 flex-col">
          <Frame chapters={chapters} lab={lab} />
        </div>
      </div>
    </InternalShell>
  )
}
