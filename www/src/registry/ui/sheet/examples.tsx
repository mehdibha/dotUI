import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Controlled from "./demos/controlled"
import DialogParts from "./demos/dialog-parts"
import Nested from "./demos/nested"
import Position from "./demos/position"
import PreventDismissal from "./demos/prevent-dismissal"
import Scrollable from "./demos/scrollable"
import SnapPoints from "./demos/snap-points"
import WithForm from "./demos/with-form"

export default function SheetExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="dialog parts">
        <DialogParts />
      </Example>
      <Example title="position">
        <Position />
      </Example>
      <Example title="snap points">
        <SnapPoints />
      </Example>
      <Example title="nested">
        <Nested />
      </Example>
      <Example title="scrollable">
        <Scrollable />
      </Example>
      <Example title="with form">
        <WithForm />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="prevent dismissal">
        <PreventDismissal />
      </Example>
    </Examples>
  )
}
