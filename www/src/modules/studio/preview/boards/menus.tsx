import CommandDemo from "@/registry/ui/command/demos/basic"
import MenuDemo from "@/registry/ui/menu/demos/basic"
import PopoverDemo from "@/registry/ui/popover/demos/basic"
import TooltipDemo from "@/registry/ui/tooltip/demos/basic"

import { Board, BoardSection } from "./board"

export default function MenusBoard() {
  return (
    <Board id="menus">
      <BoardSection
        member="menu"
        title="Menu"
        axes={[
          "menuHighlight",
          "menuInset",
          "menuArrows",
          "surfaceGlass",
          "roleItem",
          "menuIndicator",
          "menuSelectedRow",
          "menuRows",
          "mobilePickers",
          "menuMotion",
          "motion",
        ]}
      >
        <MenuDemo />
        <PopoverDemo />
      </BoardSection>
      <BoardSection member="tooltip" title="Tooltip" axes={["tooltipStyle"]}>
        <TooltipDemo />
      </BoardSection>
      <BoardSection
        member="command"
        title="Command"
        axes={["menuSearch", "menuScale"]}
      >
        <CommandDemo />
      </BoardSection>
    </Board>
  )
}
