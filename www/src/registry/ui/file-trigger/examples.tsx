import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Default from './demos/default'
import DirectorySelection from './demos/directory-selection'
import FileTypes from './demos/file-types'
import MediaCapture from './demos/media-capture'
import MultipleFiles from './demos/multiple-files'

export default function FileTriggerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="default">
        <Default />
      </Example>
      <Example title="directory selection">
        <DirectorySelection />
      </Example>
      <Example title="file types">
        <FileTypes />
      </Example>
      <Example title="media capture">
        <MediaCapture />
      </Example>
      <Example title="multiple files">
        <MultipleFiles />
      </Example>
    </Examples>
  )
}
