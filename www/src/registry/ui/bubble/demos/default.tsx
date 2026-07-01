import { Bubble, BubbleContent } from '@/registry/ui/bubble'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Bubble variant="muted" align="start">
        <BubbleContent>Hey! How can I help you today?</BubbleContent>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>Help me name my design system.</BubbleContent>
      </Bubble>
    </div>
  )
}
