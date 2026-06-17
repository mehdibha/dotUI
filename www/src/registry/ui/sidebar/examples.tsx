import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import BadgesAndActions from './demos/badges-and-actions'
import Basic from './demos/basic'
import CollapsibleIcon from './demos/collapsible-icon'
import Floating from './demos/floating'
import FooterUser from './demos/footer-user'
import Groups from './demos/groups'
import Inset from './demos/inset'
import Submenu from './demos/submenu'

export default function SidebarExamples() {
  return (
    <Examples>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Collapsible to icons">
        <CollapsibleIcon />
      </Example>
      <Example title="Floating">
        <Floating />
      </Example>
      <Example title="Inset">
        <Inset />
      </Example>
      <Example title="Groups">
        <Groups />
      </Example>
      <Example title="Badges & actions">
        <BadgesAndActions />
      </Example>
      <Example title="Nested items">
        <Submenu />
      </Example>
      <Example title="User menu">
        <FooterUser />
      </Example>
    </Examples>
  )
}
