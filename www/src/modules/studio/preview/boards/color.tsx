import AlertDemo from "@/registry/ui/alert/demos/default"
import BadgeDemo from "@/registry/ui/badge/demos/variants"
import ButtonVariants from "@/registry/ui/button/demos/variants"
import CardDemo from "@/registry/ui/card/demos/default"
import CheckboxDemo from "@/registry/ui/checkbox/demos/basic"
import SwitchDemo from "@/registry/ui/switch/demos/basic"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"

import { Board, BoardSection } from "./board"

export default function ColorBoard() {
  return (
    <Board id="color">
      <BoardSection
        member="primary"
        title="Primary"
        axes={[
          "brand",
          "solidInk",
          "buttonColor",
          "checkboxColor",
          "radioColor",
          "switchColor",
          "selectionColor",
          "sliderColor",
          "tabsColor",
          "linkColor",
          "focusColor",
        ]}
      >
        <ButtonVariants />
        <SwitchDemo />
      </BoardSection>
      <BoardSection
        member="status"
        title="Status"
        axes={["successSeed", "warningSeed", "dangerSeed", "selectionSeed"]}
      >
        <BadgeDemo />
        <AlertDemo />
      </BoardSection>
      <BoardSection
        member="surfaces"
        title="Surfaces"
        axes={[
          "surfaceLayers",
          "surfaceEdge",
          "surfaceShadow",
          "shellTone",
          "lightBg",
        ]}
      >
        <CardDemo />
      </BoardSection>
      <BoardSection
        member="controls"
        title="Controls"
        axes={["controlEdge", "selectedWash"]}
      >
        <TextFieldDemo />
        <CheckboxDemo />
      </BoardSection>
    </Board>
  )
}
