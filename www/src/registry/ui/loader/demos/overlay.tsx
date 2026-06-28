import { Loader } from '@/registry/ui/loader'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center rounded-md border border-dashed py-12">
      <div className="flex flex-col items-center gap-3 text-fg-muted">
        <Loader aria-label="Loading" className="size-6" />
        <p className="text-sm">Loading content...</p>
      </div>
    </div>
  )
}
