"use client"

import React from "react"

import { Responsive } from "@/registry/lib/responsive"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"
import { Sheet } from "@/registry/ui/sheet"

export default function Demo() {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
      <Button>Open dialog</Button>
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>This is a heading</DialogTitle>
                <DialogDescription>this is a description</DialogDescription>
              </DialogHeader>
              content here
            </DialogContent>
          )
          return isMobile ? <Sheet>{content}</Sheet> : <Modal>{content}</Modal>
        }}
      />
    </Dialog>
  )
}
