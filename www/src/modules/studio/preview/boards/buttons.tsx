import ButtonVariants from "@/registry/ui/button/demos/variants"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import PaginationDemo from "@/registry/ui/pagination/demos/default"
import SegmentedDemo from "@/registry/ui/segmented-control/demos/default"
import ToggleGroupDemo from "@/registry/ui/toggle-button-group/demos/default"
import ToggleButtonDemo from "@/registry/ui/toggle-button/demos/default"

import { Board, BoardSection, StateRow } from "./board"

export default function ButtonsBoard() {
  const styles = useButtonStyles()
  return (
    <Board id="buttons">
      <BoardSection
        member="button"
        title="Button"
        axes={[
          "buttonStyle",
          "buttonSecondary",
          "buttonRadius",
          "buttonColor",
          "labelWeight",
          "buttonPress",
          "buttonCase",
          "buttonMotion",
          "motion",
        ]}
        className="flex-col"
      >
        <ButtonVariants />
        <StateRow>
          {(props) => (
            <button {...props} className={styles({ variant: "primary" })}>
              Button
            </button>
          )}
        </StateRow>
        <StateRow>
          {(props) => (
            <button {...props} className={styles({ variant: "secondary" })}>
              Button
            </button>
          )}
        </StateRow>
      </BoardSection>
      <BoardSection member="toggle" title="Toggles" axes={["toggleSelected"]}>
        <ToggleButtonDemo />
      </BoardSection>
      <BoardSection member="group" title="Groups" axes={["groupSeparator"]}>
        <ToggleGroupDemo />
      </BoardSection>
      <BoardSection
        member="segmented"
        title="Segmented"
        axes={["segmentedSelected", "segmentedTrack"]}
      >
        <SegmentedDemo />
      </BoardSection>
      <BoardSection
        member="pagination"
        title="Pagination"
        axes={["paginationCurrent"]}
      >
        <PaginationDemo />
      </BoardSection>
    </Board>
  )
}
