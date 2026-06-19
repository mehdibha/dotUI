import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Overlay,
} from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

// Overlay is a low-level primitive: it renders its content in a Modal, Popover,
// or Drawer attached to a Dialog trigger, switching by screen size. There is no
// meaningful purely-static render — it only appears once opened over a trigger.
// These compose the canonical trigger; the popover cell uses defaultOpen to
// surface real content. See batch-5 learnings for the flag.

export const Trigger = () => (
  <div style={wrap}>
    <Dialog>
      <Button>Open overlay</Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Overlay content</DialogTitle>
          </DialogHeader>
          <DialogBody>Renders as a modal, popover, or drawer.</DialogBody>
        </DialogContent>
      </Overlay>
    </Dialog>
  </div>
)

export const PopoverType = () => (
  <div style={wrap}>
    <Dialog>
      <Button>Show popover</Button>
      <Overlay type="popover" mobileType="popover" defaultOpen>
        <DialogContent>
          <DialogBody>This overlay is rendered as a popover.</DialogBody>
        </DialogContent>
      </Overlay>
    </Dialog>
  </div>
)
