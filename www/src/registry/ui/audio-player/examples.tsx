import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Composition from './demos/composition'
import Default from './demos/default'
import Disabled from './demos/disabled'
import PlaybackSpeed from './demos/playback-speed'
import VoiceMessage from './demos/voice-message'

export default function AudioPlayerExamples() {
  return (
    <Examples>
      <Example title="default">
        <Default />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="playback speed">
        <PlaybackSpeed />
      </Example>
      <Example title="voice message">
        <VoiceMessage />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
    </Examples>
  )
}
