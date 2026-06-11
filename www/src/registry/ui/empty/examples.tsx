import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import EmptyProjects from './demos/empty-projects'
import InCard from './demos/in-card'
import WithBorder from './demos/with-border'
import WithIcon from './demos/with-icon'
import WithMutedBackground from './demos/with-muted-background'
import WithMutedBackgroundAlt from './demos/with-muted-background-alt'

export default function EmptyExamples() {
  return (
    <Examples className="**:data-example-preview:items-center">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="With muted background">
        <WithMutedBackground />
      </Example>
      <Example title="With border">
        <WithBorder />
      </Example>
      <Example title="With icon">
        <WithIcon />
      </Example>
      <Example title="With muted background alt">
        <WithMutedBackgroundAlt />
      </Example>
      <Example title="In card">
        <InCard />
      </Example>
      <Example title="Empty projects">
        <EmptyProjects />
      </Example>
    </Examples>
  )
}
