import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import DefaultExpanded from './demos/default-expanded'
import Disabled from './demos/disabled'
import DragAndDrop from './demos/drag-and-drop'
import Dynamic from './demos/dynamic'
import Empty from './demos/empty'
import Selection from './demos/selection'
import WithIcons from './demos/with-icons'

export default function TreeExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="selection">
        <Selection />
      </Example>
      <Example title="with icons">
        <WithIcons />
      </Example>
      <Example title="dynamic">
        <Dynamic />
      </Example>
      <Example title="default expanded">
        <DefaultExpanded />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="drag and drop">
        <DragAndDrop />
      </Example>
      <Example title="empty">
        <Empty />
      </Example>
    </Examples>
  )
}
