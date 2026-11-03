"use client"

import { ChevronDownIcon, PlusIcon, StarIcon } from "@/registry/icons"
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
      <BoardSection title="Sizes" className="items-end gap-x-10 gap-y-8">
        {SIZES.map(({ id, label }) => (
          <Specimen key={id} label={label}>
            <div className="flex flex-col items-center gap-3">
              <Button size={id} variant="primary">
                Save
              </Button>
              <Button size={id}>Cancel</Button>
              <Button size={id} variant="quiet">
                Edit
              </Button>
            </div>
          </Specimen>
        ))}
      </BoardSection>
      <BoardSection title="With icons" className="items-end gap-x-10 gap-y-8">
        {SIZES.map(({ id, label }) => (
          <Specimen key={id} label={label}>
            <div className="flex flex-col items-center gap-3">
              <Button size={id} variant="primary">
                <PlusIcon />
                New
              </Button>
              <Button size={id}>
                Options
                <ChevronDownIcon />
              </Button>
            </div>
          </Specimen>
        ))}
      </BoardSection>
      <BoardSection title="Icon only" className="items-end gap-x-10 gap-y-8">
        {SIZES.map(({ id, label }) => (
          <Specimen key={id} label={label}>
            <div className="flex items-center gap-2">
              <Button size={id} variant="primary" isIconOnly aria-label="Add">
                <PlusIcon />
              </Button>
              <Button size={id} isIconOnly aria-label="Star">
                <StarIcon />
              </Button>
            </div>
          </Specimen>
        ))}
      </BoardSection>
    </Board>
  )
}
