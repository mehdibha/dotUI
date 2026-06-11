import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import ControlledDemo from './demos/controlled'
import FileUploadListDemo from './demos/file-upload-list'
import ProgressValuesDemo from './demos/progress-values'
import WithLabelDemo from './demos/with-label'

export default function ProgressBarExamples() {
  return (
    <Examples className="lg:grid-cols-2">
      <Example title="Progress Bar">
        <ProgressValuesDemo />
      </Example>
      <Example title="With Label">
        <WithLabelDemo />
      </Example>
      <Example title="Controlled">
        <ControlledDemo />
      </Example>
      <Example title="File Upload List">
        <FileUploadListDemo />
      </Example>
    </Examples>
  )
}
