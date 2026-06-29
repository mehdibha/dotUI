import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <div className="w-full max-w-xs text-sm">
      <p>Above the separator</p>
      <Separator className="my-3" />
      <p>Below the separator</p>
    </div>
  )
}
