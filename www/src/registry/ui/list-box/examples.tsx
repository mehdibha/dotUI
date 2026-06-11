import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Async from './demos/async'
import Basic from './demos/basic'
import Danger from './demos/danger'
import Disabled from './demos/disabled'
import Empty from './demos/empty'
import FileActions from './demos/file-actions'
import Grid from './demos/grid'
import Horizontal from './demos/horizontal'
import Selection from './demos/multiple-selection'
import Sections from './demos/sections'
import UserMenu from './demos/user-menu'
import WithDescription from './demos/with-description'
import WithIcons from './demos/with-icons'

export default function ListBoxExamples() {
  return (
    <Examples className="md:grid-cols-2 **:[div]:has-[>[data-listbox]]:w-full">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="With icons">
        <WithIcons />
      </Example>
      <Example title="With description">
        <WithDescription />
      </Example>
      <Example title="Selection">
        <Selection />
      </Example>
      <Example title="Disabled items">
        <Disabled />
      </Example>
      <Example title="Danger action">
        <Danger />
      </Example>
      <Example title="Sections">
        <Sections />
      </Example>
      <Example title="Empty state">
        <Empty />
      </Example>
      <Example title="Horizontal">
        <Horizontal />
      </Example>
      <Example title="Grid">
        <Grid />
      </Example>
      <Example title="Async loading">
        <Async />
      </Example>
      <Example title="User menu">
        <UserMenu />
      </Example>
      <Example title="File actions with shortcuts">
        <FileActions />
      </Example>
      {/* <Example title="Inside a Select">
				<InSelect />
			</Example>
			<Example title="Inside a Combobox">
				<InCombobox />
			</Example> */}
      {/* <Example title="Inside a Command palette">
				<InCommand />
			</Example> */}
    </Examples>
  )
}
