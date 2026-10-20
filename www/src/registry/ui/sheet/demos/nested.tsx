"use client"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

export default function Demo() {
  return (
    <Dialog>
      <Button>Open parent sheet</Button>
      <Sheet>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Parent sheet</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>Open the child sheet below — this one should scale back.</p>
          </DialogBody>
          <DialogFooter>
            <Dialog>
              <Button>Open child sheet</Button>
              <Sheet>
                <DialogContent>
                  <SheetHandle />
                  <DialogHeader>
                    <DialogTitle>Child sheet</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <p>Drag me down or click outside to close just this one.</p>
                    <p className="mt-2 text-sm text-fg-muted">
                      The parent stays open underneath.
                    </p>
                  </DialogBody>
                  <DialogFooter>
                    <Dialog>
                      <Button variant="quiet">Open grandchild</Button>
                      <Sheet>
                        <DialogContent>
                          <SheetHandle />
                          <DialogHeader>
                            <DialogTitle>Grandchild</DialogTitle>
                          </DialogHeader>
                          <DialogBody>
                            <p>
                              Three levels deep. Each parent scales further
                              back.
                            </p>
                          </DialogBody>
                        </DialogContent>
                      </Sheet>
                    </Dialog>
                  </DialogFooter>
                </DialogContent>
              </Sheet>
            </Dialog>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
