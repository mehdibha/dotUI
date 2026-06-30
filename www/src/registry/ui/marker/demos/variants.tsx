import { CheckIcon } from 'lucide-react'

import { Marker, MarkerContent, MarkerIcon } from '@/registry/ui/marker'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="default">
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Context updated</MarkerContent>
      </Marker>
    </div>
  )
}
