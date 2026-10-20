"use client"

import React from "react"

import { Button } from "@/registry/ui/button"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { FieldGroup, Label } from "@/registry/ui/field"
import { Radio, RadioGroup } from "@/registry/ui/radio-group"
import { Sheet, type SheetProps } from "@/registry/ui/sheet"

export default function Demo() {
  const [position, setPosition] =
    React.useState<NonNullable<SheetProps["position"]>>("bottom")
  return (
    <div className="flex items-center gap-12">
      <Dialog>
        <Button>Open sheet</Button>
        <Sheet position={position}>
          <DialogContent aria-label="Sheet">Sheet content</DialogContent>
        </Sheet>
      </Dialog>
      <RadioGroup
        value={position}
        onChange={(value) => setPosition(value as typeof position)}
      >
        <Label>Position</Label>
        <FieldGroup className="gap-1">
          <Radio value="top">Top</Radio>
          <Radio value="start">Start</Radio>
          <Radio value="bottom">Bottom</Radio>
          <Radio value="end">End</Radio>
        </FieldGroup>
      </RadioGroup>
    </div>
  )
}
