import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Default from './demos/default'

export default function OnboardingTourExamples() {
  return (
    <Examples>
      <Example title="Default">
        <Default />
      </Example>
    </Examples>
  )
}
