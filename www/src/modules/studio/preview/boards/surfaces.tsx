"use client"

import {
  CheckIcon,
  CopyIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  PencilIcon,
  TrashIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { useStyles as useMenuStyles } from "@/registry/ui/menu/styles"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ui/sidebar"

import { Board, InMode, useBoardFocus } from "./board"
import { POINTED, ROW } from "./menus-parts"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const CARD_KEYS = ["surfaceLayers", "surfaceEdge", "surfaceShadow"]
const OVERLAY_KEYS = [...CARD_KEYS, "translucentOverlays"]
const SHELL_KEYS = ["lightBg", "darkBg", "shellTone"]

/* Each set in light above and dark below: surfaces part by small steps of
   tone, edge and shadow, and dark is where those steps vanish. */
const MODES = ["light", "dark"] as const

function Cards() {
  return (
    <>
      <Card size="sm" className="w-40">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums">
          $48,210
        </CardContent>
      </Card>
      <Card size="sm" className="w-40">
        <CardHeader>
          <CardTitle>Invite your team</CardTitle>
          <CardDescription>Work on projects together.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="primary">
            Invite
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

function Menus() {
  const { popover } = usePopoverStyles()()
  const { root, item, itemLabel, indicator } = useMenuStyles()()
  return (
    <div
      data-popover=""
      data-trigger="MenuTrigger"
      data-placement="bottom"
      className={popover({ className: "w-48" })}
    >
      <div role="menu" className={root()}>
        <div {...POINTED} className={item()}>
          <PencilIcon />
          <span className={itemLabel()}>Rename</span>
        </div>
        <div {...ROW} className={item()}>
          <CopyIcon />
          <span className={itemLabel()}>Duplicate</span>
        </div>
        <div
          {...ROW}
          data-selection-mode="single"
          data-selected="true"
          className={item()}
        >
          <span className={indicator()}>
            <CheckIcon />
          </span>
          <span className={itemLabel()}>Pinned</span>
        </div>
        <Separator />
        <div {...ROW} data-variant="danger" className={item()}>
          <TrashIcon />
          <span className={itemLabel()}>Delete</span>
        </div>
      </div>
    </div>
  )
}

function Dialogs() {
  const { modal } = useModalStyles()()
  const { content } = useDialogStyles()()
  return (
    <div data-modal="" className={modal({ className: "w-72 max-w-full" })}>
      <div className={content()}>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            Its files and history go with it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="sm">Cancel</Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </DialogFooter>
      </div>
    </div>
  )
}

const PAGES = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Projects", icon: FolderIcon, current: true },
]

function Shell() {
  return (
    <SidebarProvider className="h-40 min-h-0 w-full overflow-hidden rounded-md border">
      <Sidebar variant="inset" collapsible="none" className="w-36">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {PAGES.map((page) => (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton isActive={page.current}>
                    <page.icon />
                    <span>{page.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0 p-4 text-sm font-medium">
        Projects
      </SidebarInset>
    </SidebarProvider>
  )
}

function useEditing() {
  const { axis, holds } = useBoardFocus()
  const keys = [axis, ...(holds ?? [])]
  const edits = (set: string[]) =>
    keys.some((key) => !!key && set.includes(key))
  return {
    cards: edits(CARD_KEYS),
    overlays: edits(OVERLAY_KEYS),
    shell: edits(SHELL_KEYS),
  }
}

export default function SurfacesBoard() {
  const editing = useEditing()
  const rows = (Set: React.ComponentType) =>
    MODES.map((mode) => (
      <InMode key={mode} mode={mode}>
        <div className="flex w-full flex-wrap items-start gap-4 rounded-md border bg-bg p-5">
          <Set />
        </div>
      </InMode>
    ))
  return (
    <Board id="surfaces" untitled className={CANVAS}>
      <SetGrid>
        <ComponentSet
          name="Cards"
          selected={editing.cards}
          rows={rows(Cards)}
        />
        <ComponentSet
          name="Menus"
          selected={editing.overlays}
          rows={rows(Menus)}
        />
        <ComponentSet
          name="Dialogs"
          selected={editing.overlays}
          rows={rows(Dialogs)}
        />
        <ComponentSet
          name="App shell"
          selected={editing.shell}
          rows={rows(Shell)}
        />
      </SetGrid>
    </Board>
  )
}
