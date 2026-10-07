import AccordionDemo from "@/registry/ui/accordion/demos/basic"
import AvatarDemo from "@/registry/ui/avatar/demos/group"
import CardDemo from "@/registry/ui/card/demos/default"
import KbdDemo from "@/registry/ui/kbd/demos/basic"
import TableDemo from "@/registry/ui/table/demos/basic"

import { Board, BoardSection } from "./board"

export default function DisplayBoard() {
  return (
    <Board id="display">
      <BoardSection
        member="table"
        title="Table"
        axes={[
          "tableHeader",
          "tableHeaderLabel",
          "selectedWash",
          "surfaceLayers",
          "displayMotion",
          "motion",
        ]}
      >
        <TableDemo />
      </BoardSection>
      <BoardSection
        member="accordion"
        title="Accordion"
        axes={["accordionContainer", "accordionMarker"]}
      >
        <AccordionDemo />
      </BoardSection>
      <BoardSection
        member="avatar"
        title="Avatar"
        axes={["avatarShape", "avatarFallback"]}
      >
        <AvatarDemo />
      </BoardSection>
      <BoardSection member="kbd" title="Kbd" axes={["kbdTreatment"]}>
        <KbdDemo />
      </BoardSection>
      <BoardSection
        member="card"
        title="Card"
        axes={["cardHeader", "cardFooter"]}
      >
        <CardDemo />
      </BoardSection>
    </Board>
  )
}
