"use client"

import { useEffect, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import { XIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, CAPTION, useBoardFocus } from "./board"

/* --------------------------------- Replay --------------------------------- */

type Overlay = "dialog" | "drawer" | "mobile"

/** The overlay the panel is editing; the stage dialog by default. */
function useFocusedOverlay(): Overlay {
  const { member, axis } = useBoardFocus()
  if (member === "drawer" || axis === "drawerEdge") return "drawer"
  if (axis === "mobileDialogs") return "mobile"
  return "dialog"
}

/** Changes whenever the previewed system does: root tokens or overlay params. */
function useSystemSignal() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })
    return () => observer.disconnect()
  }, [])
  const modal = useComponentParams("modal")
  const drawer = useComponentParams("drawer")
  const dialog = useComponentParams("dialog")
  return `${version}|${JSON.stringify([modal, drawer, dialog])}`
}

interface Replay {
  key: number
  entering: boolean
}

/** Remounts the focused overlay in its entering pose, then lets it settle. */
function useReplay(overlay: Overlay): Replay {
  const focused = useFocusedOverlay() === overlay
  const { member, axis } = useBoardFocus()
  const signal = `${member}|${axis}|${useSystemSignal()}`
  const [replay, setReplay] = useState<Replay>({ key: 0, entering: false })
  useEffect(() => {
    if (!focused) return
    setReplay((r) => ({ key: r.key + 1, entering: true }))
    // A timer, not rAF: a hidden preview never ticks rAF and would stay hidden.
    const timer = setTimeout(
      () => setReplay((r) => ({ ...r, entering: false })),
      40,
    )
    return () => {
      clearTimeout(timer)
      setReplay((r) => (r.entering ? { ...r, entering: false } : r))
    }
  }, [focused, signal])
  return replay
}

/* ------------------------------- The page ------------------------------- */

const PROJECTS = [
  { name: "Acme Web", meta: "Deployed 2h ago", tone: "bg-primary" },
  { name: "Billing API", meta: "Deployed yesterday", tone: "bg-success" },
  { name: "Docs", meta: "Building", tone: "bg-warning" },
  { name: "Mobile", meta: "Failed 3d ago", tone: "bg-danger" },
  { name: "Analytics", meta: "Deployed 5d ago", tone: "bg-info" },
  { name: "Marketing", meta: "Deployed 1w ago", tone: "bg-neutral" },
]

/** What a modal layer covers: a projects page, so scrim and frost read. */
function Page() {
  return (
    <div
      aria-hidden
      className="@container absolute inset-0 flex flex-col bg-bg text-fg"
    >
      <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
        <span className="text-sm font-medium">Projects</span>
        <Button variant="primary" size="sm">
          New project
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 @md:grid-cols-2 @3xl:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card key={project.name} size="sm">
            <CardContent className="flex flex-col gap-3">
              <div
                className={cn(
                  "h-14 rounded-(--studio-radius-item) opacity-70",
                  project.tone,
                )}
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium">{project.name}</span>
                <span className="text-xs text-fg-muted">{project.meta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** A screen-sized frame: the layers' viewport. */
function Screen({
  height,
  className,
  children,
}: {
  height: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      inert
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={
        { height, "--visual-viewport-height": height } as React.CSSProperties
      }
    >
      <Page />
      {children}
    </div>
  )
}

/* ------------------------------- Dialog parts ------------------------------ */

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

const PEOPLE = [
  { name: "Maya Chen", email: "maya@acme.co", role: "Owner" },
  { name: "Leo Park", email: "leo@acme.co", role: "Admin" },
  { name: "Sara Diaz", email: "sara@acme.co", role: "Editor" },
  { name: "Tom Becker", email: "tom@acme.co", role: "Viewer" },
  { name: "Ines Moreau", email: "ines@acme.co", role: "Viewer" },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

/** Header, a scrolling body, footer actions and the close button. */
function InviteDialog({ className }: { className?: string }) {
  const { content } = useDialogStyles()()
  return (
    <div className={content({ className })}>
      <DialogHeader>
        <DialogTitle>Invite to Acme</DialogTitle>
        <DialogDescription>
          Teammates can view and edit every project.
        </DialogDescription>
      </DialogHeader>
      {/* Capped so it scrolls; a short viewport scrolls the whole dialog instead. */}
      <DialogBody className="max-h-44 overflow-y-auto in-data-modal:[@container_(height<31.25rem)]:max-h-none">
        <TextField>
          <Label>Email</Label>
          <Input placeholder="name@company.com" />
        </TextField>
        {PEOPLE.map((person) => (
          <div key={person.name} className="flex items-center gap-3 py-1">
            <Avatar size="sm">
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium">{person.name}</span>
              <span className="truncate text-xs text-fg-muted">
                {person.email}
              </span>
            </div>
            <span className="text-xs text-fg-muted">{person.role}</span>
          </div>
        ))}
      </DialogBody>
      <DialogFooter>
        <Button>Cancel</Button>
        <Button variant="primary">Send invite</Button>
      </DialogFooter>
      <Close />
    </div>
  )
}

/* --------------------------------- Layers --------------------------------- */

/** The registry modal's layers, frozen open inside a Screen. */
function ModalLayer({
  replay,
  className,
  viewportClassName,
  children,
}: {
  replay: Replay
  className?: string
  viewportClassName?: string
  children: React.ReactNode
}) {
  const { overlay, backdrop, viewport, modal } = useModalStyles()()
  const top = useComponentParams("modal").position === "top"
  const entering = replay.entering || undefined
  return (
    <div
      key={replay.key}
      data-entering={entering}
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
          data-modal=""
          data-entering={entering}
          className={modal({ className })}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/** The registry drawer's layers, frozen open inside a Screen. */
function DrawerLayer({
  placement,
  replay,
  className,
  children,
}: {
  placement: "bottom" | "right"
  replay?: Replay
  className?: string
  children: React.ReactNode
}) {
  const { overlay, backdrop, viewport, popup, handle } = useDrawerStyles()({
    placement,
  })
  const starting = replay?.entering || undefined
  return (
    <div key={replay?.key} className={overlay({ className: "absolute" })}>
      <div data-starting-style={starting} className={backdrop()} />
      <div className={viewport({ className: "absolute" })}>
        <div
          data-drawer=""
          data-starting-style={starting}
          className={popup({ className })}
        >
          {placement === "bottom" && (
            <div data-orientation="horizontal" className={handle()} />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- Sections -------------------------------- */

function DialogStage() {
  const replay = useReplay("dialog")
  return (
    // Tall enough that Top's inset leaves the short-viewport layout off.
    <Screen height="36rem">
      <ModalLayer replay={replay} className="max-w-[calc(100%-2rem)]">
        <InviteDialog />
      </ModalLayer>
    </Screen>
  )
}

function AlertStage() {
  const { content } = useDialogStyles()()
  return (
    <Screen height="22rem">
      <ModalLayer
        replay={{ key: 0, entering: false }}
        className="max-w-[calc(100%-2rem)]"
      >
        <div role="alertdialog" className={content()}>
          <DialogHeader>
            <DialogTitle>Delete Acme Web?</DialogTitle>
            <DialogDescription>
              This removes the project and its 14 deployments. It can't be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button variant="danger">Delete project</Button>
          </DialogFooter>
        </div>
      </ModalLayer>
    </Screen>
  )
}

function Specimen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-(--studio-radius-card) border">
        {children}
      </div>
      <span className={CAPTION}>{label}</span>
    </div>
  )
}

function DrawerStages() {
  const replay = useReplay("drawer")
  const { content } = useDialogStyles()()
  return (
    <>
      <Specimen label="Side sheet">
        <Screen height="26rem">
          <DrawerLayer
            placement="right"
            replay={replay}
            className="w-72 max-w-[calc(100%-3rem)]"
          >
            <div className={content()}>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Shown on every project.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <TextField defaultValue="Maya Chen">
                  <Label>Name</Label>
                  <Input />
                </TextField>
                <TextField defaultValue="maya@acme.co">
                  <Label>Email</Label>
                  <Input />
                </TextField>
              </DialogBody>
              <DialogFooter>
                <Button>Cancel</Button>
                <Button variant="primary">Save</Button>
              </DialogFooter>
            </div>
          </DrawerLayer>
        </Screen>
      </Specimen>
      <Specimen label="Bottom drawer">
        <Screen height="26rem">
          <DrawerLayer placement="bottom" replay={replay}>
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
            </div>
          </DrawerLayer>
        </Screen>
      </Specimen>
    </>
  )
}

// The fullscreen pick's max-md classes, unprefixed: the phone is narrower than the board.
const FULLSCREEN =
  "min-h-full min-w-full rounded-none border-0 [--surface-radius:0px] *:max-h-none *:flex-1 **:data-[slot=dialog-footer]:mt-auto"

/** A dialog on a phone: centered, a bottom sheet, or the whole screen. */
function PhoneStage() {
  const replay = useReplay("mobile")
  const mobile = useComponentParams("modal").mobile ?? "center"
  return (
    <div className="rounded-[2.75rem] border-[6px] border-fg/10 shadow-lg">
      <div className="w-68 overflow-hidden rounded-[2.4rem]">
        <Screen height="36rem">
          {mobile === "sheet" ? (
            <DrawerLayer placement="bottom" replay={replay}>
              <InviteDialog />
            </DrawerLayer>
          ) : (
            <ModalLayer
              replay={replay}
              className={
                mobile === "fullscreen"
                  ? FULLSCREEN
                  : "max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-2rem)]"
              }
              viewportClassName={mobile === "fullscreen" ? "pt-0" : undefined}
            >
              <InviteDialog />
            </ModalLayer>
          )}
        </Screen>
      </div>
    </div>
  )
}

/** A dialog in a popover: translucent over the page when overlays are glass. */
function PopoverStage() {
  const { popover } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  return (
    <Screen height="22rem">
      <div
        data-popover=""
        className={popover({ className: "absolute top-14 right-4 w-72" })}
      >
        <div className={content()}>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Starts from the main branch.</DialogDescription>
          </DialogHeader>
          <TextField defaultValue="Acme Mobile">
            <Label>Name</Label>
            <Input />
          </TextField>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button variant="primary">Create</Button>
          </DialogFooter>
        </div>
      </div>
    </Screen>
  )
}

const FRAME = "overflow-hidden p-0 max-sm:p-0"

export default function DialogsBoard() {
  return (
    <Board id="dialogs">
      <BoardSection
        member="modal"
        title="Dialog"
        axes={[
          "dialogSections",
          "dialogActions",
          "dialogClose",
          "dialogBackdrop",
          "dialogBackdropStrength",
          "dialogFrost",
          "rolePanel",
          "dialogMotion",
          "dialogEntrance",
          "dialogPosition",
        ]}
        className={FRAME}
      >
        <DialogStage />
      </BoardSection>
      <BoardSection
        member="alert-dialog"
        title="Alert dialog"
        axes={["dialogActions", "dialogBackdrop", "dialogPosition"]}
        className={FRAME}
      >
        <AlertStage />
      </BoardSection>
      <BoardSection
        member="drawer"
        title="Drawer"
        axes={["drawerEdge", "rolePanel", "dialogBackdrop", "dialogMotion"]}
        className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2"
      >
        <DrawerStages />
      </BoardSection>
      <BoardSection member="mobile" title="Mobile" axes={["mobileDialogs"]}>
        <PhoneStage />
      </BoardSection>
      <BoardSection
        member="popover-dialog"
        title="Popover dialog"
        axes={["surfaceGlass"]}
        className={FRAME}
      >
        <PopoverStage />
      </BoardSection>
    </Board>
  )
}
