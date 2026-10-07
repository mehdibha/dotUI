import AreaDemo from "@/registry/ui/chart-area/demos/default"
import BarDemo from "@/registry/ui/chart-bar/demos/default"

import { Board, BoardSection } from "./board"

export default function ChartsBoard() {
  return (
    <Board id="charts">
      <BoardSection
        member="area"
        title="Area chart"
        axes={["chartPalette", "chartGrid", "chartMotion", "brand", "motion"]}
      >
        <AreaDemo />
      </BoardSection>
      <BoardSection
        member="bar"
        title="Bar chart"
        axes={["chartPalette", "chartGrid"]}
      >
        <BarDemo />
      </BoardSection>
    </Board>
  )
}
