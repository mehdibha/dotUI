"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import { XIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
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
import { Input } from "@/registry/ui/input"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, RAC_STATE } from "./board"
import type { Phase } from "./board"
import { SheetLayer, People, Screen, useEditedPresence } from "./dialogs-parts"

const MOTION = ["dialogMotion", "dialogEntrance"]

function Close() {
  const { closeButton } = useDialogStyles()()
  return (
    <Button
      variant="quiet"
      size="sm"
      isIconOnly
      aria-label="Close"
      className={closeButton()}
    >
      <XIcon />
    </Button>
  )
}

/** Ends the body halfway through its third teammate, so it reads as scrolling. */
function useHalfRowCap(body: React.RefObject<HTMLDivElement | null>) {
  const [cap, setCap] = useState<number>()
  useLayoutEffect(() => {
    const element = body.current
    const row = element?.querySelectorAll<HTMLElement>("[data-person]")[2]
    if (!element?.firstElementChild || !row) return
    const measure = () =>
      setCap(row.offsetTop - element.offsetTop + row.offsetHeight / 2)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element.firstElementChild)
    observer.observe(row)
    return () => observer.disconnect()
  }, [body])
  return cap
}

/** Header, a scrolling body, footer actions and the close button. */
function InviteDialog({
  phone = false,
  capped = true,
}: {
  phone?: boolean
  capped?: boolean
}) {
  const { content } = useDialogStyles()()
  const { footer } = useComponentParams("dialog")
  const body = useRef<HTMLDivElement>(null)
  const cap = useHalfRowCap(body)
  // End stacks below sm; the phone frame shows it at any viewport.
  const stacked = phone && footer?.startsWith("end")
  return (
    <div className={content()}>
      <DialogHeader>
        <DialogTitle>Invite to Acme</DialogTitle>
        <DialogDescription>
          Teammates can view and edit every project.
        </DialogDescription>
      </DialogHeader>
      <DialogBody
        ref={body}
        className={cn(
          "overflow-y-auto",
          // A short viewport scrolls the whole dialog instead.
          capped &&
            "max-h-(--body-cap) in-data-modal:[@container_(height<31.25rem)]:max-h-none",
        )}
        style={
          cap
            ? ({ "--body-cap": `${cap}px` } as React.CSSProperties)
            : undefined
        }
      >
        <TextField>
          <Label>Email</Label>
          <Input placeholder="name@company.com" />
        </TextField>
        <People />
      </DialogBody>
      <DialogFooter className={stacked ? "sm:flex-col-reverse" : undefined}>
        <Button>Cancel</Button>
        <Button variant="primary">Send invite</Button>
      </DialogFooter>
      <Close />
    </div>
  )
}

/** The registry modal's layers, held inside a Screen. */
function ModalLayer({
  phase,
  className,
  viewportClassName,
  children,
}: {
  phase: Phase
  className?: string
  viewportClassName?: string
  children: React.ReactNode
}) {
  const { overlay, backdrop, viewport, modal } = useModalStyles()()
  const top = useComponentParams("modal").position === "top"
  if (phase === "closed") return null
  return (
    <div
      {...RAC_STATE[phase]}
      className={overlay({ className: "inset-0 h-full" })}
    >
      <div className={backdrop()} />
      <div
        className={viewport({
          className: cn(
            "absolute inset-0 h-full",
            // Top's 10vh, of the Screen rather than the iframe.
            top && "pt-[calc(var(--visual-viewport-height)/10)]",
            viewportClassName,
          ),
        })}
      >
        <div
          data-rac=""
          data-modal=""
          {...RAC_STATE[phase]}
          className={modal({ className })}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Tall enough that Top's inset keeps the modal's short-viewport layout (< 31.25rem) off.
const HEIGHT = "35rem"

function DesktopStage() {
  const ref = useRef<HTMLDivElement>(null)
  const { phase, live } = useEditedPresence(ref, MOTION)
  return (
    <Screen ref={ref} height={HEIGHT} live={live}>
      <ModalLayer phase={phase} className="max-w-[calc(100%-2rem)]">
        <InviteDialog />
      </ModalLayer>
    </Screen>
  )
}

// The fullscreen pick's max-md classes, unprefixed: the phone is narrower than the board.
const FULLSCREEN =
  "min-h-full min-w-full rounded-none border-0 [--surface-radius:0px] *:max-h-none *:flex-1 **:data-dialog-footer:mt-auto"

/** The dialog on a phone: centered, a bottom sheet, or the whole screen. */
function PhoneStage() {
  const ref = useRef<HTMLDivElement>(null)
  const { phase, live } = useEditedPresence(ref, [...MOTION, "mobileDialogs"])
  const mobile = useComponentParams("modal").mobile ?? "center"
  return (
    <div className="w-68 overflow-hidden rounded-[2.5rem] border">
      <Screen ref={ref} height={HEIGHT} live={live}>
        {mobile === "sheet" ? (
          <SheetLayer position="bottom" phase={phase}>
            <InviteDialog phone />
          </SheetLayer>
        ) : (
          <ModalLayer
            phase={phase}
            className={
              mobile === "fullscreen"
                ? FULLSCREEN
                : "max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-2rem)]"
            }
            viewportClassName={mobile === "fullscreen" ? "pt-0" : undefined}
          >
            <InviteDialog phone capped={mobile !== "fullscreen"} />
          </ModalLayer>
        )}
      </Screen>
    </div>
  )
}

export default function DialogBoard() {
  return (
    <Board id="dialog">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        {/* Below md the preview is a phone: the Mobile frame is the truth. */}
        <div className="min-w-0 max-md:hidden">
          <BoardSection title="In context" className="overflow-hidden p-0">
            <DesktopStage />
          </BoardSection>
        </div>
        <BoardSection
          title="Mobile"
          className="rounded-none border-0 bg-transparent p-0 max-sm:p-0"
        >
          <PhoneStage />
        </BoardSection>
      </div>
    </Board>
  )
}
