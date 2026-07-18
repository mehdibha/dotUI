import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Disabled from './demos/disabled'
import DragAndDrop from './demos/drag-and-drop'
import Grid from './demos/grid'
import MultipleSelection from './demos/multiple-selection'
import WithDescription from './demos/with-description'

export default function GridListExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Multiple selection">
        <MultipleSelection />
      </Example>
      <Example title="With description">
        <WithDescription />
      </Example>
      <Example title="Grid layout">
        <Grid />
      </Example>
      <Example title="Disabled items">
        <Disabled />
      </Example>
      <Example title="Drag and drop">
        <DragAndDrop />
      </Example>
    </Examples>
  )
}
