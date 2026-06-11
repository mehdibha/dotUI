import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Register from './demos/register'

export default function ReactHookFormExamples() {
  return (
    <Examples>
      <Example title="register">
        <Register />
      </Example>
    </Examples>
  )
}
