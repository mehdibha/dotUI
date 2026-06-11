import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Popover } from '@/registry/ui/popover'

const placements = [
  { label: 'Start', placement: 'bottom start' },
  { label: 'Center', placement: 'bottom' },
  { label: 'End', placement: 'bottom end' },
] as const

export default function Demo() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {placements.map((placement) => (
        <Dialog key={placement.label}>
          <Button variant="default" size="sm">
            {placement.label}
          </Button>
          <Popover placement={placement.placement} className="w-48">
            <DialogContent
              aria-label={`Placed at ${placement.label.toLowerCase()}`}
            >
              Placed at bottom {placement.label.toLowerCase()}
            </DialogContent>
          </Popover>
        </Dialog>
      ))}
    </div>
  )
}
