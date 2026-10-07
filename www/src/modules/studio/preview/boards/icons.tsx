import ButtonIconsDemo from "@/registry/ui/button/demos/prefix-and-suffix"
import MenuIconsDemo from "@/registry/ui/menu/demos/with-icons"

import { Board, BoardSection } from "./board"

export default function IconsBoard() {
  return (
    <Board id="icons">
      <BoardSection
        member="icons"
        title="Icons"
        axes={["iconLibrary", "iconStroke", "iconWeight"]}
      >
        <MenuIconsDemo />
        <ButtonIconsDemo />
      </BoardSection>
    </Board>
  )
}
