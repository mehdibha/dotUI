import DialogDemo from '@/registry/ui/dialog/demos/basic'
import DrawerDemo from '@/registry/ui/drawer/demos/basic'
import ModalDemo from '@/registry/ui/modal/demos/basic'
import OverlayDemo from '@/registry/ui/overlay/demos/basic'
import PopoverDemo from '@/registry/ui/popover/demos/basic'
import TooltipDemo from '@/registry/ui/tooltip/demos/basic'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function OverlaysGroupExamples() {
  return (
    <Examples>
      <Example title="Tooltip">
        <TooltipDemo />
      </Example>
      <Example title="Popover">
        <PopoverDemo />
      </Example>
      <Example title="Dialog">
        <DialogDemo />
      </Example>
      <Example title="Modal">
        <ModalDemo />
      </Example>
      <Example title="Drawer">
        <DrawerDemo />
      </Example>
      <Example title="Overlay">
        <OverlayDemo />
      </Example>
    </Examples>
  )
}
