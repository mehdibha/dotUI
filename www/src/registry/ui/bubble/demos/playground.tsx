import { Bubble, BubbleContent } from '@/registry/ui/bubble'

export default function Demo({
  variant = 'muted',
  align = 'start',
  children = 'How can I help you today?',
}: {
  variant?:
    | 'default'
    | 'secondary'
    | 'muted'
    | 'tinted'
    | 'outline'
    | 'ghost'
    | 'destructive'
  align?: 'start' | 'end'
  children?: string
} = {}) {
  return (
    <Bubble variant={variant} align={align}>
      <BubbleContent>{children}</BubbleContent>
    </Bubble>
  )
}
