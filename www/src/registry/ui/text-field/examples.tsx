import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Controlled from './demos/controlled'
import Description from './demos/description'
import Disabled from './demos/disabled'
import ErrorMessage from './demos/error-message'
import Label from './demos/label'
import PrefixAndSuffix from './demos/prefix-and-suffix'
import ReadOnly from './demos/read-only'
import Required from './demos/required'
import Sizes from './demos/sizes'
import Uncontrolled from './demos/uncontrolled'

export default function TextFieldExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="error message">
        <ErrorMessage />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="prefix and suffix">
        <PrefixAndSuffix />
      </Example>
      <Example title="read only">
        <ReadOnly />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
    </Examples>
  )
}
