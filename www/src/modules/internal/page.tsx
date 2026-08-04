"use client"

/* /internal — the index of every internal tool, so the labs are navigable
   instead of URLs you have to remember. */

import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"

import { INTERNAL_TOOLS } from "./registry"
import { InternalShell } from "./shell"

export function InternalIndex() {
  return (
    <InternalShell
      crumbs={[]}
      title="Internal"
      description="Scratch surfaces for building dotUI — design labs, benches and measurement tools. None of this ships or is linked from the site."
    >
      <ul className="grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
        {INTERNAL_TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              to={tool.href}
              className="group/tool flex h-full cursor-interactive flex-col gap-1.5 rounded-xl border border-border/45 bg-card p-4 focus-reset transition-colors hover:bg-muted focus-visible:focus-ring"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[0.8125rem] font-medium text-fg">
                  {tool.label}
                </span>
                <ArrowUpRightIcon className="size-3.5 text-fg-muted opacity-0 transition-opacity group-hover/tool:opacity-100" />
              </span>
              <span className="text-xs/relaxed text-pretty text-fg-muted">
                {tool.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </InternalShell>
  )
}
