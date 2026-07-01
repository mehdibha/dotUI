import { Bubble, BubbleContent, BubbleReactions } from '@/registry/ui/bubble'

export default function Demo() {
  return (
    <Bubble variant="muted" align="start" className="max-w-sm">
      <BubbleContent>
        I checked the registry output and removed the stale route.
      </BubbleContent>
      <BubbleReactions>
        <span>👍 3</span>
        <span>🎉 1</span>
      </BubbleReactions>
    </Bubble>
  )
}
