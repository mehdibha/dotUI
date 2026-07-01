import { Bubble, BubbleContent } from '@/registry/ui/bubble'

const VARIANTS = [
  'default',
  'secondary',
  'muted',
  'tinted',
  'outline',
  'ghost',
  'destructive',
] as const

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-2">
      {VARIANTS.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>{variant}</BubbleContent>
        </Bubble>
      ))}
    </div>
  )
}
