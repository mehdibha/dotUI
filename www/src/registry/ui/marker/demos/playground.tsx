import { Marker, MarkerContent } from '@/registry/ui/marker'

export default function Demo({
  variant = 'default',
  children = 'Explored 4 files',
}: {
  variant?: 'default' | 'border' | 'separator'
  children?: string
} = {}) {
  return (
    <Marker variant={variant}>
      <MarkerContent>{children}</MarkerContent>
    </Marker>
  )
}
