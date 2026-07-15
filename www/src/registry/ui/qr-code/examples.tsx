import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import WithLogo from './demos/with-logo'

export default function QRCodeExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="with logo">
        <WithLogo />
      </Example>
    </Examples>
  )
}
