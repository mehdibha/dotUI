import CommandDemo from '@/registry/ui/command/demos/basic'
import ListBoxDemo from '@/registry/ui/list-box/demos/basic'
import MenuDemo from '@/registry/ui/menu/demos/basic'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function MenusListsGroupExamples() {
  return (
    <Examples>
      <Example title="Menu">
        <MenuDemo />
      </Example>
      <Example title="List Box">
        <ListBoxDemo />
      </Example>
      <Example title="Command">
        <CommandDemo />
      </Example>
    </Examples>
  )
}
