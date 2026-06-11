import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Alphanumeric from './demos/alphanumeric'
import Basic from './demos/basic'
import Controlled from './demos/controlled'
import Disabled from './demos/disabled'
import ErrorMessage from './demos/error-message'
import Form from './demos/form'
import FourDigits from './demos/four-digits'
import Separator from './demos/separator'

export default function OTPFieldExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="separator">
        <Separator />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="error message">
        <ErrorMessage />
      </Example>
      <Example title="four digits">
        <FourDigits />
      </Example>
      <Example title="alphanumeric">
        <Alphanumeric />
      </Example>
      <Example title="form">
        <Form />
      </Example>
    </Examples>
  )
}
