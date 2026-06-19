import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Popover,
} from 'www'

export const Open = () => (
  <Dialog defaultOpen>
    <Button variant="default">Open popover</Button>
    <Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dimensions</DialogTitle>
          <DialogDescription>Set the dimensions of the layer.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Popover>
  </Dialog>
)
