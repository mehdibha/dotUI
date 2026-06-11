import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Navigation from './demos/navigation'
import Nested from './demos/nested'
import Pagination from './demos/pagination'
import PaginationSplit from './demos/pagination-split'
import TextAlignment from './demos/text-alignment'
import Vertical from './demos/vertical'
import VerticalNested from './demos/vertical-nested'
import WithDropdown from './demos/with-dropdown'
import WithFields from './demos/with-fields'
import WithIcons from './demos/with-icons'
import WithInput from './demos/with-input'
import WithLike from './demos/with-like'
import WithSelect from './demos/with-select'
import WithSelectAndInput from './demos/with-select-and-input'
import WithText from './demos/with-text'

export default function GroupExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="with input">
        <WithInput />
      </Example>
      <Example title="with text">
        <WithText />
      </Example>
      <Example title="with dropdown">
        <WithDropdown />
      </Example>
      <Example title="with select">
        <WithSelect />
      </Example>
      <Example title="with icons">
        <WithIcons />
      </Example>
      <Example title="with fields">
        <WithFields />
      </Example>
      <Example title="with like">
        <WithLike />
      </Example>
      <Example title="with select and input">
        <WithSelectAndInput />
      </Example>
      <Example title="nested">
        <Nested />
      </Example>
      <Example title="pagination">
        <Pagination />
      </Example>
      <Example title="pagination split">
        <PaginationSplit />
      </Example>
      <Example title="navigation">
        <Navigation />
      </Example>
      <Example title="text alignment">
        <TextAlignment />
      </Example>
      <Example title="vertical">
        <Vertical />
      </Example>
      <Example title="vertical nested">
        <VerticalNested />
      </Example>
    </Examples>
  )
}
