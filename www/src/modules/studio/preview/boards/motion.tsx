import AreaDemo from "@/registry/ui/chart-area/demos/default"
import DrawerDemo from "@/registry/ui/drawer/demos/basic"
import LoaderDemo from "@/registry/ui/loader/demos/basic"
import MenuDemo from "@/registry/ui/menu/demos/basic"
import ModalDemo from "@/registry/ui/modal/demos/basic"
import SkeletonDemo from "@/registry/ui/skeleton/demos/card"
import TooltipDemo from "@/registry/ui/tooltip/demos/basic"

import { Board, BoardSection } from "./board"

export default function MotionBoard() {
  return (
    <Board id="motion">
      <BoardSection
        member="motion"
        title="Motion"
        axes={["motion", "motionEntrance"]}
      >
        <MenuDemo />
        <TooltipDemo />
      </BoardSection>
      <BoardSection
        member="overlays"
        title="Overlays"
        axes={["dialogEntrance", "mobilePickers"]}
      >
        <ModalDemo />
        <DrawerDemo />
      </BoardSection>
      <BoardSection
        member="loading"
        title="Loading"
        axes={["skeletonAnimation", "spinnerStyle"]}
      >
        <LoaderDemo />
        <SkeletonDemo />
      </BoardSection>
      <BoardSection member="charts" title="Charts" axes={["chartMotion"]}>
        <AreaDemo />
      </BoardSection>
    </Board>
  )
}
