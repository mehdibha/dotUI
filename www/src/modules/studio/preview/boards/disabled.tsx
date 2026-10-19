"use client"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Input } from "@/registry/ui/input"
import { Switch } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, Specimen } from "./board"

function Controls({ disabled }: { disabled?: boolean }) {
  return (
    <Specimen label={disabled ? "Disabled" : "Enabled"}>
      <div inert className="flex flex-col gap-2.5">
        <div className="flex gap-3">
          <Button variant="primary" isDisabled={disabled}>
            Publish
          </Button>
          <Button isDisabled={disabled}>Preview</Button>
        </div>
        <div className="flex items-center gap-4">
          <TextField
            aria-label="Workspace"
            defaultValue="acme-inc"
            isDisabled={disabled}
            className="w-24"
          >
            <Input />
          </TextField>
          <Checkbox
            aria-label="Email digest"
            defaultSelected
            isDisabled={disabled}
          />
          <Switch
            aria-label="Auto-renew"
            defaultSelected
            isDisabled={disabled}
          />
        </div>
      </div>
    </Specimen>
  )
}

export default function DisabledBoard() {
  return (
    <Board id="disabled">
      <BoardSection title="Disabled" className="gap-x-12 gap-y-6">
        <Controls />
        <Controls disabled />
      </BoardSection>
    </Board>
  )
}
