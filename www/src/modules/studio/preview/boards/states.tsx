import ButtonDisabled from "@/registry/ui/button/demos/disabled"
import CheckboxDemo from "@/registry/ui/checkbox/demos/basic"
import InputDisabled from "@/registry/ui/input/demos/disabled"
import InputInvalid from "@/registry/ui/input/demos/invalid"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"

import { Board, BoardSection } from "./board"

export default function StatesBoard() {
  return (
    <Board id="states">
      <BoardSection
        member="focus"
        title="Focus"
        axes={[
          "focusStyle",
          "focusColor",
          "focusStrength",
          "focusWidth",
          "focusInputStyle",
          "focusInputWeight",
          "focusInputColor",
        ]}
      >
        <TextFieldDemo />
      </BoardSection>
      <BoardSection
        member="disabled"
        title="Disabled"
        axes={["disabledTreatment"]}
      >
        <ButtonDisabled />
        <InputDisabled />
      </BoardSection>
      <BoardSection
        member="invalid"
        title="Invalid"
        axes={["invalidStyle", "inputStyle"]}
      >
        <InputInvalid />
      </BoardSection>
      <BoardSection
        member="cursors"
        title="Cursors"
        axes={["cursorControls", "cursorDisabled"]}
      >
        <CheckboxDemo />
      </BoardSection>
      <BoardSection
        member="selection"
        title="Selection"
        axes={["selectionUiText", "selectionHighlight"]}
      >
        <p className="max-w-md text-sm">
          Select this sentence to see the highlight.
        </p>
      </BoardSection>
    </Board>
  )
}
