import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Account from "./demos/account"
import SingleSelectionWithIcons from "./demos/checkboxes-with-icons"
import Complex from "./demos/complex"
import InDialog from "./demos/in-dialog"
import MultipleSelection from "./demos/multiple-selection"
import RadioWithIcons from "./demos/radio-with-icons"
import Sides from "./demos/sides"
import SingleSelection from "./demos/single-selection"
import WithAvatar from "./demos/with-avatar"
import WithDestructive from "./demos/with-destructive"
import WithDrawer from "./demos/with-drawer"
import WithIcons from "./demos/with-icons"
import WithModal from "./demos/with-modal"
import WithShortcuts from "./demos/with-shortcuts"
import WithSubmenu from "./demos/with-submenu"

export default function MenuExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Account />
      </Example>
      <Example title="Complex">
        <Complex />
      </Example>
      <Example title="Sides" className="md:col-span-2">
        <Sides />
      </Example>
      <Example title="With icons">
        <WithIcons />
      </Example>
      <Example title="With shortcuts">
        <WithShortcuts />
      </Example>
      <Example title="With submenu">
        <WithSubmenu />
      </Example>
      <Example title="Multiple selection">
        <MultipleSelection />
      </Example>
      <Example title="Single selection with icons">
        <SingleSelectionWithIcons />
      </Example>
      <Example title="Single selection">
        <SingleSelection />
      </Example>
      <Example title="Radio with icons">
        <RadioWithIcons />
      </Example>
      <Example title="With destructive items">
        <WithDestructive />
      </Example>
      <Example title="With avatar">
        <WithAvatar />
      </Example>
      <Example title="With drawer">
        <WithDrawer />
      </Example>
      <Example title="With modal">
        <WithModal />
      </Example>
      <Example title="In dialog">
        <InDialog />
      </Example>
    </Examples>
  )
}
