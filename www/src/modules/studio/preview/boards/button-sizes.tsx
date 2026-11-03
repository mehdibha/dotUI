"use client"

import { Button } from "@/registry/ui/button"

import { Board, BoardSection, Specimen } from "./board"

const SIZES = [
  { id: "xs", label: "XS" },
  { id: "sm", label: "SM" },
  { id: "md", label: "MD" },
  { id: "lg", label: "LG" },
] as const

export default function ButtonSizesBoard() {
  return (
    <Board id="button-sizes">
      <BoardSection title="Sizes" className="items-end gap-10">
        {SIZES.map(({ id, label }) => (
          <Specimen key={id} label={label}>
            <Button size={id}>Button</Button>
          </Specimen>
        ))}
      </BoardSection>
    </Board>
  )
}
