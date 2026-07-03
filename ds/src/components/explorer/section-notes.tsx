import type { Note } from '@/data/schema'

import { SourceLinks } from './source-links'

interface SectionNotesProps {
  notes: Note[]
}

/** Sourced editorial findings for the active section — the stuff the data alone can't say. */
export function SectionNotes({ notes }: SectionNotesProps) {
  if (notes.length === 0) return null
  return (
    <aside className="mt-10 rounded-xl border bg-muted/30 p-5">
      <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
        Notes
      </h3>
      <ul className="mt-3 flex flex-col gap-4">
        {notes.map((note) => (
          <li key={note.text} className="flex gap-3">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 flex-none rounded-full bg-fg-muted"
            />
            <div>
              <p className="text-sm leading-relaxed">{note.text}</p>
              <SourceLinks sources={note.sources} className="mt-1.5" />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
