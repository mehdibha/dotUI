import CheckboxDemo from "@/registry/ui/checkbox/demos/basic"
import ChoiceCardsDemo from "@/registry/ui/radio-group/demos/cards"
import RadioDemo from "@/registry/ui/radio-group/demos/default"
import SliderDemo from "@/registry/ui/slider/demos/default"
import SwitchDemo from "@/registry/ui/switch/demos/basic"

import { Board, BoardSection } from "./board"

export default function SelectionBoard() {
  return (
    <Board id="selection">
      <BoardSection
        member="checkbox"
        title="Checkbox"
        axes={[
          "checkboxColor",
          "controlEdge",
          "controlStroke",
          "checkCorner",
          "checkEdge",
          "selectionMotion",
          "motion",
        ]}
      >
        <CheckboxDemo />
      </BoardSection>
      <BoardSection
        member="radio"
        title="Radio"
        axes={["radioMark", "radioColor"]}
      >
        <RadioDemo />
      </BoardSection>
      <BoardSection
        member="switch"
        title="Switch"
        axes={["switchStyle", "switchColor"]}
      >
        <SwitchDemo />
      </BoardSection>
      <BoardSection
        member="slider"
        title="Slider"
        axes={["sliderThumb", "sliderTrack", "sliderColor"]}
      >
        <SliderDemo />
      </BoardSection>
      <BoardSection
        member="choice-card"
        title="Choice cards"
        axes={["cardSelected", "cardColor"]}
      >
        <ChoiceCardsDemo />
      </BoardSection>
    </Board>
  )
}
