import AvatarDemo from '@/registry/ui/avatar/demos/default'
import CardDemo from '@/registry/ui/card/demos/default'
import GroupDemo from '@/registry/ui/group/demos/basic'
import { Separator } from '@/registry/ui/separator'
import TableDemo from '@/registry/ui/table/demos/basic'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ContainersGroupExamples() {
  return (
    <Examples>
      <Example title="Card">
        <CardDemo />
      </Example>
      <Example title="Table">
        <TableDemo />
      </Example>
      <Example title="Avatar">
        <AvatarDemo />
      </Example>
      <Example title="Group">
        <GroupDemo />
      </Example>
      <Example title="Separator">
        <div className="flex w-full max-w-md flex-col gap-3">
          <p className="text-sm">Above</p>
          <Separator />
          <p className="text-sm">Below</p>
        </div>
      </Example>
    </Examples>
  )
}
