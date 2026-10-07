import ButtonSizes from "@/registry/ui/button/demos/sizes"
import MenuDemo from "@/registry/ui/menu/demos/basic"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"

import { Board, BoardSection } from "./board"

export default function SpaceBoard() {
  return (
    <Board id="space">
      <BoardSection
        member="density"
        title="Density"
        axes={["density", "inputHeight", "menuRows", "uiTextSize"]}
      >
        <ButtonSizes />
        <TextFieldDemo />
        <MenuDemo />
      </BoardSection>
    </Board>
  )
}
