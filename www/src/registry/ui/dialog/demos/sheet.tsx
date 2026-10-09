"use client"

import React from "react"
import type * as MenuPrimitives from "react-aria-components/Menu"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Select, SelectContent, SelectItem } from "@/registry/ui/select"
import { Sheet } from "@/registry/ui/sheet"
import { Switch } from "@/registry/ui/switch"

export default function Demo() {
  const [placement, setPlacement] = React.useState<MenuPrimitives.Key | null>(
    "top",
  )
  const [swipeable, setSwipeable] = React.useState<boolean>(true)
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center justify-center">
        <Dialog>
          <Button variant="secondary">Open sheet</Button>
          <Sheet>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Help</DialogTitle>
                <DialogDescription>
                  For help accessing your account, please contact support.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Sheet>
        </Dialog>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <Select value={placement} onChange={setPlacement}>
          <Label>Placement</Label>
          <SelectContent>
            <SelectItem id="top">Top</SelectItem>
            <SelectItem id="bottom">Bottom</SelectItem>
          </SelectContent>
        </Select>
        <Switch isSelected={swipeable} onChange={setSwipeable}>
          Swipeable
        </Switch>
      </div>
    </div>
  )
}
