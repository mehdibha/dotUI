"use client"

import { useRef } from "react"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection } from "./board"
import { DrawerLayer, People, Screen, useEditedPresence } from "./dialogs-parts"

const MOTION = ["sheetMotion"]
// The dialog page's frame height.
const HEIGHT = "35rem"
const FRAME = "overflow-hidden p-0 max-sm:p-0"

function SideStage() {
  const ref = useRef<HTMLDivElement>(null)
  const { phase, live } = useEditedPresence(ref, MOTION)
  const { content } = useDialogStyles()()
  return (
    <Screen ref={ref} height={HEIGHT} live={live}>
      <DrawerLayer
        placement="right"
        phase={phase}
        className="w-80 max-w-[calc(100%-3rem)]"
      >
        <div className={content({ className: "h-full" })}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Shown on every project.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <Button size="sm">Change photo</Button>
            </div>
            <TextField defaultValue="Maya Chen">
              <Label>Name</Label>
              <Input />
            </TextField>
            <TextField defaultValue="maya@acme.co">
              <Label>Email</Label>
              <Input />
            </TextField>
            <TextField defaultValue="Lisbon, Portugal">
              <Label>Location</Label>
              <Input />
            </TextField>
            <TextField defaultValue="Design lead at Acme. Ships the web app and its design system.">
              <Label>Bio</Label>
              <TextArea rows={3} />
            </TextField>
          </DialogBody>
          <DialogFooter className="mt-auto">
            <Button>Cancel</Button>
            <Button variant="primary">Save</Button>
          </DialogFooter>
        </div>
      </DrawerLayer>
    </Screen>
  )
}

function BottomStage() {
  const ref = useRef<HTMLDivElement>(null)
  const { phase, live } = useEditedPresence(ref, MOTION)
  const { content } = useDialogStyles()()
  return (
    <Screen ref={ref} height={HEIGHT} live={live}>
      <DrawerLayer placement="bottom" phase={phase}>
        <div className={content()}>
          <DialogHeader>
            <DialogTitle>Share Acme Web</DialogTitle>
            <DialogDescription>
              Anyone with the link can view.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <TextField aria-label="Link" className="min-w-0 flex-1">
              <Input value="acme.co/s/k2f9" readOnly />
            </TextField>
            <Button>Copy</Button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-fg-muted">
              People with access
            </span>
            <People count={3} />
          </div>
        </div>
      </DrawerLayer>
    </Screen>
  )
}

export default function SheetBoard() {
  return (
    <Board id="sheet">
      <div className="grid min-w-0 gap-8 md:grid-cols-2">
        <BoardSection title="Side" className={FRAME}>
          <SideStage />
        </BoardSection>
        <BoardSection title="Bottom" className={FRAME}>
          <BottomStage />
        </BoardSection>
      </div>
    </Board>
  )
}
