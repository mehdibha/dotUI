"use client"

import type { CatalogEntry, SystemEntry } from "~/data/schema"

import { LiveComponents } from "./components"
import { getSectionGroups } from "./registry"

export function SystemExplorer({
  system,
  catalogEntry,
}: {
  system: SystemEntry
  catalogEntry?: CatalogEntry
}) {
  const groups = getSectionGroups(system.slug)

  return (
    <div className="flex flex-col gap-16 pt-12 pb-28">
      {groups.map((group) => (
        <div
          key={group.id}
          className={group.id === "overview" ? "" : "mt-20 border-t pt-12"}
        >
          {group.id !== "overview" && (
            <header className="mb-12 max-w-2xl">
              <h2 className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
                {group.label}
              </h2>
              <p className="mt-2 text-lg text-balance text-fg">{group.blurb}</p>
            </header>
          )}
          <div className="flex flex-col gap-16">
            {group.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <section.Component
                  system={system}
                  catalogEntry={catalogEntry}
                />
              </section>
            ))}
          </div>
        </div>
      ))}
      {system.components && (
        <section id="live-components" className="scroll-mt-24">
          <LiveComponents system={system} />
        </section>
      )}
    </div>
  )
}
