import DialogDemo from "@/registry/ui/dialog/demos/basic"
import DrawerDemo from "@/registry/ui/drawer/demos/basic"
import ModalDemo from "@/registry/ui/modal/demos/basic"

import { Board, BoardSection } from "./board"

export default function DialogsBoard() {
  return (
    <Board id="dialogs">
      <BoardSection
        member="dialog"
        title="Dialog"
        axes={[
          "dialogSections",
          "dialogBackdrop",
          "dialogBackdropStrength",
          "dialogFrost",
          "mobileDialogs",
          "rolePanel",
          "surfaceGlass",
          "dialogActions",
          "dialogClose",
          "dialogEntrance",
          "dialogMotion",
          "motion",
        ]}
      >
        <DialogDemo />
      </BoardSection>
      <BoardSection member="modal" title="Modal" axes={["dialogPosition"]}>
        <ModalDemo />
      </BoardSection>
      <BoardSection member="drawer" title="Drawer" axes={["drawerEdge"]}>
        <DrawerDemo />
      </BoardSection>
    </Board>
  )
}
