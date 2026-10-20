"use client"

import {
  ArchiveIcon,
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
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
  LayersIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  MicIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TagIcon,
  TrashIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  XIcon,
  ZapIcon,
} from "@/registry/icons"
import { IconLibraryContext } from "@/registry/icons/create-icon"
import { iconLibraries } from "@/registry/icons/icon-map"
import { Button } from "@/registry/ui/button"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, Specimen } from "./board"

const GLYPHS = [
  HomeIcon,
  SearchIcon,
  InboxIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
  FolderIcon,
  FileTextIcon,
  ImageIcon,
  CameraIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  TagIcon,
  LinkIcon,
  ShareIcon,
  CopyIcon,
  PencilIcon,
  TrashIcon,
  ArchiveIcon,
  DownloadIcon,
  UploadIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  MoreHorizontalIcon,
  EyeIcon,
  ClockIcon,
  GlobeIcon,
  ShieldIcon,
  ZapIcon,
  SparklesIcon,
  LayersIcon,
  CodeIcon,
  MessageSquareIcon,
  SendIcon,
  MicIcon,
  SunIcon,
  MoonIcon,
  InfoIcon,
  TriangleAlertIcon,
  LogOutIcon,
]

const NAV = [
  { Icon: HomeIcon, label: "Home" },
  { Icon: InboxIcon, label: "Inbox" },
  { Icon: CalendarIcon, label: "Calendar" },
  { Icon: SettingsIcon, label: "Settings" },
]

const SIZES = ["size-4", "size-5", "size-6", "size-8"]

// Every library's chunk loads with the board, so trying one never flashes
// the fallback set.
function WarmLibraries() {
  return (
    <div hidden>
      {iconLibraries.map(({ name }) => (
        <IconLibraryContext.Provider key={name} value={name}>
          <SearchIcon />
        </IconLibraryContext.Provider>
      ))}
    </div>
  )
}

export default function IconsBoard() {
  return (
    <Board id="icons">
      <WarmLibraries />
      <BoardSection title="Set">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-y-6 text-fg">
          {GLYPHS.map((Icon, i) => (
            <span key={i} className="flex justify-center">
              <Icon className="size-6" />
            </span>
          ))}
        </div>
      </BoardSection>
      <BoardSection title="Sizes">
        <div className="flex w-full flex-wrap items-end justify-center gap-12">
          {SIZES.map((size) => (
            <Specimen key={size} label={size.replace("size-", "")}>
              <span className="flex items-end gap-3">
                <SettingsIcon className={size} />
                <HeartIcon className={size} />
                <SparklesIcon className={size} />
              </span>
            </Specimen>
          ))}
        </div>
      </BoardSection>
      <BoardSection title="In context" className="items-start gap-x-16 gap-y-8">
        <Specimen label="Buttons">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="primary">
              <PlusIcon />
              New project
            </Button>
            <Button>
              <ShareIcon />
              Share
            </Button>
            <Button variant="quiet" isIconOnly aria-label="More">
              <MoreHorizontalIcon />
            </Button>
          </div>
        </Specimen>
        <Specimen label="Field" className="w-full max-w-64">
          <TextField aria-label="Search" className="w-full">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search…" />
            </InputGroup>
          </TextField>
        </Specimen>
        <Specimen label="Navigation" className="w-full max-w-56">
          <ul className="flex w-full flex-col gap-1 text-sm">
            {NAV.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex h-8 items-center gap-2.5 px-2 text-fg-muted"
              >
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
        </Specimen>
      </BoardSection>
    </Board>
  )
}
