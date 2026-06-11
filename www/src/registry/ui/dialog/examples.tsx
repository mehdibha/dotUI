import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AlertDialog from './demos/alert-dialog'
import AsyncFormSubmission from './demos/async-form-submission'
import Basic from './demos/basic'
import Composition from './demos/composition'
import Controlled from './demos/controlled'
import Description from './demos/description'
import Dismissable from './demos/dismissable'
import Drawer from './demos/drawer'
import InsetContent from './demos/inset-content'
import Nested from './demos/nested'
import Popover from './demos/popover'
import Title from './demos/title'
import Types from './demos/types'

export default function DialogExamples() {
  return (
    <Examples>
      <Example title="alert dialog">
        <AlertDialog />
      </Example>
      <Example title="async form submission">
        <AsyncFormSubmission />
      </Example>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="dismissable">
        <Dismissable />
      </Example>
      <Example title="drawer">
        <Drawer />
      </Example>
      <Example title="inset content">
        <InsetContent />
      </Example>
      <Example title="nested">
        <Nested />
      </Example>
      <Example title="popover">
        <Popover />
      </Example>
      <Example title="title">
        <Title />
      </Example>
      <Example title="types">
        <Types />
      </Example>
    </Examples>
  )
}
