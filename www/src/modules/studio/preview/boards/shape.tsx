import ButtonVariants from "@/registry/ui/button/demos/variants"
import CardDemo from "@/registry/ui/card/demos/default"
import CheckboxDemo from "@/registry/ui/checkbox/demos/basic"
import SliderDemo from "@/registry/ui/slider/demos/default"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"

import { Board, BoardSection } from "./board"

export default function ShapeBoard() {
  return (
    <Board id="shape">
      <BoardSection
        member="radius"
        title="Radius"
        axes={[
          "radiusPx",
          "rolePanel",
          "roleCard",
          "roleSurface",
          "roleControl",
          "roleItem",
        ]}
      >
        <ButtonVariants />
        <TextFieldDemo />
        <CardDemo />
      </BoardSection>
      <BoardSection
        member="strokes"
        title="Strokes"
        axes={["controlStroke", "tracks"]}
      >
        <CheckboxDemo />
        <SliderDemo />
      </BoardSection>
    </Board>
  )
}
