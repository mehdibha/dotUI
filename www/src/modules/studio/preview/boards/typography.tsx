import ButtonVariants from "@/registry/ui/button/demos/variants"
import TabsDemo from "@/registry/ui/tabs/demos/basic"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"

import { Board, BoardSection } from "./board"

export default function TypographyBoard() {
  return (
    <Board id="typography">
      <BoardSection
        member="fonts"
        title="Fonts"
        axes={[
          "headingFont",
          "bodyFont",
          "readingFont",
          "monoFont",
          "titleStyle",
        ]}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <p className="font-heading text-3xl font-semibold">Ship it today</p>
          <p className="font-reading text-base text-fg-muted">
            The quick brown fox jumps over the lazy dog.
          </p>
          <code className="font-mono text-sm">npx shadcn add button</code>
        </div>
      </BoardSection>
      <BoardSection
        member="sizes"
        title="Sizes"
        axes={["uiTextSize", "fieldTextSize", "density"]}
      >
        <TextFieldDemo />
        <ButtonVariants />
      </BoardSection>
      <BoardSection
        member="labels"
        title="Labels"
        axes={["labelWeight", "sectionLabels"]}
      >
        <TabsDemo />
      </BoardSection>
    </Board>
  )
}
