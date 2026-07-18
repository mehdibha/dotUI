import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Composition from './demos/composition'
import Default from './demos/default'
import Minimal from './demos/minimal'
import PlaybackRate from './demos/playback-rate'

export default function VideoPlayerExamples() {
  return (
    <Examples>
      <Example title="default">
        <Default />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="minimal">
        <Minimal />
      </Example>
      <Example title="playback rate">
        <PlaybackRate />
      </Example>
    </Examples>
  )
}
