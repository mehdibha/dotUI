import { Marker, MarkerContent } from '@/registry/ui/marker'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerContent shimmer>Searching the web…</MarkerContent>
      </Marker>
    </div>
  )
}
