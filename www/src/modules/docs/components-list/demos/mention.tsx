import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback } from '@/registry/ui/avatar'

// A static reproduction of the Mention component: a focused field mid-sentence
// with the suggestions popover open on an active `@` query. Every surface uses
// the real design-system token classes (field, popover, highlighted menu item)
// so it restyles under any preset.
const SUGGESTIONS = [
  { id: 'sarahjones', name: 'Sarah Jones' },
  { id: 'samlee', name: 'Sam Lee' },
  { id: 'sandrapatel', name: 'Sandra Patel' },
]

export function MentionDemo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="flex w-full max-w-[19rem] flex-col">
        <div className="rounded-(--input-radius) border border-border-focus bg-field px-3 py-2.5 text-sm/relaxed text-fg ring-2 ring-border-focus-muted">
          <span className="break-words whitespace-pre-wrap">
            Great work{' '}
            <span className="rounded-sm bg-muted px-1 font-medium text-fg">
              @alexmiller
            </span>{' '}
            and @sa
          </span>
        </div>

        <div
          data-popover=""
          className="mt-2 rounded-(--popover-radius) border bg-popover p-1 shadow-md"
        >
          {SUGGESTIONS.map((person, i) => {
            const active = i === 0
            return (
              <div
                key={person.id}
                className={cn(
                  'flex items-center gap-2 rounded-sm px-2 py-1.5',
                  active && 'bg-highlight text-fg-on-highlight',
                )}
              >
                <Avatar size="sm">
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-[0.8rem] font-medium">
                    {person.name}
                  </span>
                  <span
                    className={cn(
                      'truncate text-xs',
                      active ? 'text-fg-on-highlight/70' : 'text-fg-muted',
                    )}
                  >
                    @{person.id}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
