import { ScrollFade } from '@/registry/ui/scroll-fade'

const items = [
  'Inbox',
  'Drafts',
  'Sent',
  'Archive',
  'Spam',
  'Trash',
  'Starred',
  'Snoozed',
]

export function ScrollFadeDemo() {
  return (
    <ScrollFade className="h-40 w-52">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-md bg-muted px-3 py-2 text-sm">
            {item}
          </div>
        ))}
      </div>
    </ScrollFade>
  )
}
