import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Disabled from "./demos/disabled"
import DisabledItems from "./demos/disabled-items"
import InDialog from "./demos/in-dialog"
import Invalid from "./demos/invalid"
import LargeList from "./demos/large-list"
import Multiple from "./demos/multiple"
import MultipleDisabled from "./demos/multiple-disabled"
import MultipleInvalid from "./demos/multiple-invalid"
import Sections from "./demos/sections"
import Sides from "./demos/sides"
import WithCustomItems from "./demos/with-custom-items"
import WithForm from "./demos/with-form"
import WithGroupsAndSeparator from "./demos/with-groups-and-separator"
import WithIcon from "./demos/with-icon"

export default function ComboboxExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Disabled">
        <Disabled />
      </Example>
      <Example title="Invalid">
        <Invalid />
      </Example>
      <Example title="With groups">
        <Sections />
      </Example>
      <Example title="With groups and separator">
        <WithGroupsAndSeparator />
      </Example>
      <Example title="Large list (1000 items)">
        <LargeList />
      </Example>
      <Example title="With icon addon">
        <WithIcon />
      </Example>
      <Example title="Form with combobox">
        <WithForm />
      </Example>
      <Example title="Combobox multiple">
        <Multiple />
      </Example>
      <Example title="Combobox multiple disabled">
        <MultipleDisabled />
      </Example>
      <Example title="Combobox multiple invalid">
        <MultipleInvalid />
      </Example>
      <Example title="Items with description">
        <WithCustomItems />
      </Example>
      <Example title="Combobox in dialog">
        <InDialog />
      </Example>
      <Example title="Disabled items">
        <DisabledItems />
      </Example>
      <Example title="Sides" className="md:col-span-2">
        <Sides />
      </Example>
    </Examples>
  )
}
