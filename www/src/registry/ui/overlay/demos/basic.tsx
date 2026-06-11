import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'

export default function Demo() {
  return (
    <Dialog>
      <Button>Open overlay</Button>
      <Overlay>
        <DialogContent>some content</DialogContent>
      </Overlay>
    </Dialog>
  )
}
