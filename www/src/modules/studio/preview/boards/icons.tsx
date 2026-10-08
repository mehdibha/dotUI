import {
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CameraIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  FolderIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  InfoIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MapIcon,
  MessageSquareIcon,
  MicIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  ShoppingCartIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertTitle } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ui/sidebar"

import { Board, BoardSection, CAPTION } from "./board"

const SET = [
  SearchIcon,
  HomeIcon,
  InboxIcon,
  CalendarIcon,
  BellIcon,
  MailIcon,
  UserIcon,
  SettingsIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  FolderIcon,
  FileTextIcon,
  ImageIcon,
  CameraIcon,
  MicIcon,
  LinkIcon,
  ShareIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  PencilIcon,
  CopyIcon,
  EyeIcon,
  ClockIcon,
  GlobeIcon,
  MapIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  MessageSquareIcon,
  SunIcon,
  ZapIcon,
]

const SIZES = [16, 20, 24, 32] as const
const SIZE_CLASS = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  32: "size-8",
}
const SIZED = [HomeIcon, SearchIcon, BellIcon, SettingsIcon, HeartIcon]

const NAV = [
  { title: "Home", icon: HomeIcon, isActive: true },
  { title: "Inbox", icon: InboxIcon, badge: "12" },
  { title: "Calendar", icon: CalendarIcon },
  { title: "Settings", icon: SettingsIcon },
]

function Tile({
  label,
  wide,
  className,
  children,
}: {
  label: string
  wide?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-3", wide && "@xl:col-span-2")}
    >
      <span className={CAPTION}>{label}</span>
      <div className={className}>{children}</div>
    </div>
  )
}

export default function IconsBoard() {
  const { popover } = usePopoverStyles()()
  return (
    <Board id="icons">
      <BoardSection
        member="set"
        title="Set"
        axes={["iconLibrary"]}
        className="block overflow-hidden p-0 max-sm:p-0"
      >
        <div className="@container">
          <div className="grid grid-cols-4 gap-px bg-border text-fg @xl:grid-cols-8">
            {SET.map((Icon, i) => (
              <div
                key={i}
                className="flex h-16 items-center justify-center bg-bg @xl:h-22"
              >
                <Icon className="size-6" />
              </div>
            ))}
          </div>
        </div>
      </BoardSection>

      <BoardSection member="in-context" title="In context">
        <div className="@container w-full">
          <div className="grid items-start gap-x-10 gap-y-8 @xl:grid-cols-2">
            <Tile label="Buttons" className="flex flex-wrap items-center gap-2">
              <Button variant="primary">
                <UploadIcon data-icon="inline-start" />
                Upload
              </Button>
              <Button variant="secondary">
                Continue
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <Button variant="secondary" isIconOnly aria-label="Add">
                <PlusIcon />
              </Button>
            </Tile>
            <Tile label="Search">
              <SearchField aria-label="Search" placeholder="Search projects" />
            </Tile>
            <Tile label="Menu">
              <div className={popover({ className: "w-fit" })}>
                <MenuContent aria-label="Account" className="min-w-40">
                  <MenuItem>
                    <UserIcon />
                    Profile
                  </MenuItem>
                  <MenuItem>
                    <CreditCardIcon />
                    Billing
                  </MenuItem>
                  <MenuItem>
                    <SettingsIcon />
                    Settings
                  </MenuItem>
                  <Separator />
                  <MenuItem variant="danger">
                    <LogOutIcon />
                    Log out
                  </MenuItem>
                </MenuContent>
              </div>
            </Tile>
            <Tile label="Sidebar">
              <SidebarProvider className="min-h-0 w-full max-w-60 rounded-(--studio-sidebar-radius,var(--radius-lg)) border bg-sidebar p-2 [--surface-bg:var(--color-sidebar)]">
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.isActive}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarProvider>
            </Tile>
            <Tile label="Alerts" wide className="grid gap-3 @3xl:grid-cols-3">
              <Alert variant="info">
                <InfoIcon />
                <AlertTitle>New sign-in detected</AlertTitle>
              </Alert>
              <Alert variant="success">
                <CircleCheckIcon />
                <AlertTitle>Changes published</AlertTitle>
              </Alert>
              <Alert variant="warning">
                <TriangleAlertIcon />
                <AlertTitle>Trial ends in 3 days</AlertTitle>
              </Alert>
            </Tile>
          </div>
        </div>
      </BoardSection>

      <BoardSection
        member="sizes"
        title="Sizes and stroke"
        axes={["iconStroke", "iconWeight"]}
      >
        <div className="@container w-full">
          <div className="grid items-end gap-6 @max-3xl:mx-auto @max-3xl:w-fit @3xl:grid-cols-4 @3xl:gap-y-8">
            {SIZES.map((size) => (
              <div
                key={size}
                className="grid grid-cols-[3rem_1fr] items-center @3xl:flex @3xl:flex-col-reverse @3xl:gap-4"
              >
                <span className={cn(CAPTION, "tabular-nums")}>{size}px</span>
                <div className="flex items-center gap-3 text-fg @3xl:justify-center">
                  {SIZED.slice(0, size === 32 ? 3 : SIZED.length).map(
                    (Icon, i) => (
                      <Icon key={i} className={SIZE_CLASS[size]} />
                    ),
                  )}
                </div>
              </div>
            ))}
            <div className="col-span-full flex items-center justify-center gap-6 border-t pt-6 text-fg @3xl:gap-8 @3xl:pt-8">
              {[SearchIcon, HeartIcon, SettingsIcon].map((Icon, i) => (
                <Icon key={i} className="size-12 @3xl:size-16" />
              ))}
            </div>
          </div>
        </div>
      </BoardSection>
    </Board>
  )
}
