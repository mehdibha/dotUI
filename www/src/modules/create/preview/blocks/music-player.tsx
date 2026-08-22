"use client"

import { useEffect, useState } from "react"

import {
  AudioLinesIcon,
  BadgeCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CircleDotIcon,
  ClockIcon,
  DownloadIcon,
  HeartIcon,
  HomeIcon,
  ListIcon,
  MaximizeIcon,
  MicIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RadioIcon,
  SearchIcon,
  ShareIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
import { Slider, SliderControl } from "@/registry/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* Transport and media glyphs are absent from the curated icon set — these
   follow the same 24px lucide geometry so they sit with the rest. */

function Glyph({ children, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

function PlayIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Glyph>
  )
}

function PauseIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </Glyph>
  )
}

function SkipBackIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" x2="5" y1="19" y2="5" />
    </Glyph>
  )
}

function SkipForwardIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" x2="19" y1="5" y2="19" />
    </Glyph>
  )
}

function ShuffleIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </Glyph>
  )
}

function RepeatIcon({
  one,
  ...props
}: { one?: boolean } & React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      {one && <path d="M11 10h1v4" />}
    </Glyph>
  )
}

function MusicIcon(props: React.ComponentProps<"svg">) {
  return (
    <Glyph {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </Glyph>
  )
}

/* --------------------------------- Content -------------------------------- */

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  plays: string
  explicit?: boolean
}

const TRACKS: Track[] = [
  {
    id: "neon-cartography",
    title: "Neon Cartography",
    artist: "Vesper Lane",
    album: "Neon Cartography",
    duration: 232,
    plays: "4,182,930",
  },
  {
    id: "harbour-lights",
    title: "Harbour Lights",
    artist: "Vesper Lane",
    album: "Neon Cartography",
    duration: 257,
    plays: "3,640,118",
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    artist: "Vesper Lane, Ilse Mareva",
    album: "Neon Cartography",
    duration: 208,
    plays: "2,915,704",
    explicit: true,
  },
  {
    id: "slow-transit",
    title: "Slow Transit",
    artist: "Vesper Lane",
    album: "Paper Antenna",
    duration: 304,
    plays: "2,483,266",
  },
  {
    id: "copper-wire",
    title: "Copper Wire",
    artist: "Vesper Lane",
    album: "Paper Antenna",
    duration: 221,
    plays: "1,974,552",
  },
  {
    id: "midnight-ferry",
    title: "Midnight Ferry",
    artist: "Vesper Lane",
    album: "Long Way Around",
    duration: 275,
    plays: "1,608,391",
  },
  {
    id: "cassette-sunrise",
    title: "Cassette Sunrise",
    artist: "Vesper Lane",
    album: "Long Way Around",
    duration: 178,
    plays: "1,204,880",
  },
  {
    id: "low-tide-signal",
    title: "Low Tide Signal",
    artist: "Vesper Lane",
    album: "Field Notes",
    duration: 249,
    plays: "962,317",
  },
]

const ALBUMS = [
  { title: "Neon Cartography", year: "2025", tracks: 11 },
  { title: "Paper Antenna", year: "2023", tracks: 9 },
  { title: "Long Way Around", year: "2021", tracks: 12 },
  { title: "Field Notes", year: "2019", tracks: 6 },
]

const LIBRARY = [
  { title: "Home", icon: HomeIcon, isActive: true },
  { title: "Browse", icon: SearchIcon },
  { title: "Radio", icon: RadioIcon },
  { title: "Recently added", icon: ClockIcon, badge: "12" },
  { title: "Liked songs", icon: HeartIcon, badge: "248" },
]

const PLAYLISTS = [
  "Late Night Drive",
  "Deep Focus",
  "Sunday Kitchen",
  "Analog Warmth",
  "Running Club 180",
]

const GENRES = ["Ambient pop", "Shoegaze", "Dream folk", "Electronica"]

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

/* -------------------------------- Fragments ------------------------------- */

function AlbumArt({
  className,
  iconClassName,
}: {
  className?: string
  iconClassName?: string
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted",
        className,
      )}
    >
      <MusicIcon className={cn("size-5", iconClassName)} />
    </div>
  )
}

function LibrarySidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Cadence">
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                <AudioLinesIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-fg">Cadence</span>
                <span className="text-xs">Premium</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchField aria-label="Search library" placeholder="Search library" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {LIBRARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Playlists</SidebarGroupLabel>
          <SidebarGroupAction aria-label="New playlist">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {PLAYLISTS.map((playlist) => (
                <SidebarMenuItem key={playlist}>
                  <SidebarMenuButton tooltip={playlist}>
                    <ListIcon />
                    <span>{playlist}</span>
                  </SidebarMenuButton>
                  <Menu>
                    <SidebarMenuAction
                      showOnHover
                      aria-label="Playlist actions"
                    >
                      <MoreHorizontalIcon />
                    </SidebarMenuAction>
                    <Popover>
                      <MenuContent>
                        <MenuItem>Add to queue</MenuItem>
                        <MenuItem>Rename</MenuItem>
                        <MenuItem>
                          <ShareIcon />
                          Share
                        </MenuItem>
                        <Separator />
                        <MenuItem variant="danger">Delete playlist</MenuItem>
                      </MenuContent>
                    </Popover>
                  </Menu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Menu>
              <SidebarMenuButton size="lg" tooltip="Mara Vidal">
                <Avatar className="size-8">
                  <AvatarFallback>MV</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5 leading-none">
                  <span className="truncate font-medium text-fg">
                    Mara Vidal
                  </span>
                  <span className="truncate text-xs">mara@vidal.studio</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
              <Popover>
                <MenuContent>
                  <MenuItem>Account</MenuItem>
                  <MenuItem>
                    <DownloadIcon />
                    Downloads
                  </MenuItem>
                  <MenuItem>Playback settings</MenuItem>
                  <Separator />
                  <MenuItem>Log out</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <Button variant="quiet" size="sm" isIconOnly aria-label="Go back">
        <ChevronLeftIcon />
      </Button>
      <Button variant="quiet" size="sm" isIconOnly aria-label="Go forward">
        <ChevronRightIcon />
      </Button>
      <SearchField
        aria-label="Search songs, artists and albums"
        placeholder="Songs, artists, albums"
        className="ml-2 hidden max-w-xs md:flex"
      />
      <div className="ml-auto flex items-center gap-2">
        <Badge appearance="subtle" variant="accent" className="hidden sm:flex">
          <BadgeCheckIcon className="size-3" />
          Lossless
        </Badge>
        <Menu>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="More options"
          >
            <MoreHorizontalIcon />
          </Button>
          <Popover>
            <MenuContent>
              <MenuItem>Start a listening party</MenuItem>
              <MenuItem>Connect a device</MenuItem>
              <MenuItem>Audio quality</MenuItem>
            </MenuContent>
          </Popover>
        </Menu>
      </div>
    </header>
  )
}

function Hero({
  isLiked,
  onLikeChange,
  onPlay,
}: {
  isLiked: boolean
  onLikeChange: (liked: boolean) => void
  onPlay: () => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-end">
        <AlbumArt
          className="aspect-square w-36 rounded-lg lg:w-44"
          iconClassName="size-10"
        />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge appearance="subtle">Album</Badge>
            <span className="text-sm text-fg-muted">
              2025 · 11 tracks · 42 min
            </span>
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Neon Cartography
          </h1>
          <p className="max-w-prose text-sm text-pretty text-fg-muted">
            Vesper Lane maps a city after midnight — tape-saturated synths, a
            borrowed drum machine and a voice recorded in a stairwell in Porto.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="primary" onPress={onPlay}>
              <PlayIcon data-icon-start="" />
              Play
            </Button>
            <Button variant="secondary" onPress={onPlay}>
              <ShuffleIcon data-icon-start="" />
              Shuffle
            </Button>
            <Tooltip>
              <ToggleButton
                variant="quiet"
                isIconOnly
                isSelected={isLiked}
                onChange={onLikeChange}
                aria-label="Save album to library"
              >
                <HeartIcon className={isLiked ? "fill-current" : undefined} />
              </ToggleButton>
              <TooltipContent>Save to library</TooltipContent>
            </Tooltip>
            <Menu>
              <Button variant="quiet" isIconOnly aria-label="Album actions">
                <MoreHorizontalIcon />
              </Button>
              <Popover>
                <MenuContent>
                  <MenuItem>Add to playlist</MenuItem>
                  <MenuItem>
                    <DownloadIcon />
                    Download
                  </MenuItem>
                  <MenuItem>
                    <ShareIcon />
                    Copy album link
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrackTable({
  currentId,
  isPlaying,
  onSelect,
}: {
  currentId: string
  isPlaying: boolean
  onSelect: (id: string) => void
}) {
  return (
    <TableContainer>
      <Table
        aria-label="Popular tracks"
        selectionMode="single"
        selectionBehavior="replace"
        disallowEmptySelection
        selectedKeys={[currentId]}
        onSelectionChange={(keys) => {
          if (keys === "all") return
          const [first] = [...keys]
          if (first !== undefined) onSelect(String(first))
        }}
      >
        <TableHeader>
          <TableColumn className="w-10 text-right">#</TableColumn>
          <TableColumn isRowHeader>Title</TableColumn>
          <TableColumn className="hidden sm:table-cell">Artist</TableColumn>
          <TableColumn className="hidden xl:table-cell">Album</TableColumn>
          <TableColumn className="hidden text-right lg:table-cell">
            Plays
          </TableColumn>
          <TableColumn className="w-16 text-right">Time</TableColumn>
        </TableHeader>
        <TableBody>
          {TRACKS.map((track, index) => {
            const isCurrent = track.id === currentId
            return (
              <TableRow key={track.id} id={track.id}>
                <TableCell className="text-right text-fg-muted tabular-nums">
                  {isCurrent && isPlaying ? (
                    <AudioLinesIcon className="size-4 text-fg-accent" />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "truncate font-medium",
                        isCurrent && "text-fg-accent",
                      )}
                    >
                      {track.title}
                    </span>
                    {track.explicit && (
                      <Badge size="sm" appearance="subtle" variant="neutral">
                        E
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-fg-muted sm:hidden">
                    {track.artist}
                  </span>
                </TableCell>
                <TableCell className="hidden text-fg-muted sm:table-cell">
                  {track.artist}
                </TableCell>
                <TableCell className="hidden text-fg-muted xl:table-cell">
                  {track.album}
                </TableCell>
                <TableCell className="hidden text-right text-fg-muted tabular-nums lg:table-cell">
                  {track.plays}
                </TableCell>
                <TableCell className="text-right text-fg-muted tabular-nums">
                  {formatTime(track.duration)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function AlbumsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {ALBUMS.map((album) => (
        <Card key={album.title}>
          <CardContent className="flex flex-col gap-3">
            <AlbumArt
              className="aspect-square w-full rounded-lg"
              iconClassName="size-8"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate font-medium">{album.title}</span>
              <span className="text-xs text-fg-muted">
                {album.year} · {album.tracks} tracks
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function AboutPanel() {
  const stats = [
    { label: "Monthly listeners", value: "1,284,660" },
    { label: "Followers", value: "312,905" },
    { label: "In your library", value: "37 songs" },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>VL</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">Vesper Lane</span>
              <span className="text-sm text-fg-muted">Porto, Portugal</span>
            </div>
          </div>
          <p className="text-sm text-pretty text-fg-muted">
            Vesper Lane is the recording alias of Ana Sequeira, who spent three
            winters building the songs on Neon Cartography out of field
            recordings, a broken Juno-60 and half-speed tape loops. She tours as
            a trio with Ilse Mareva and Tomás Reis.
          </p>
          <TagGroup>
            <Label>Genres</Label>
            <TagList>
              {GENRES.map((genre) => (
                <Tag key={genre}>{genre}</Tag>
              ))}
            </TagList>
          </TagGroup>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col divide-y">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-fg-muted">{stat.label}</span>
              <span className="font-medium tabular-nums">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function NowPlayingBar({
  track,
  elapsed,
  onSeek,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  isLiked,
  onLikeChange,
  isShuffling,
  onShuffleChange,
  repeat,
  onRepeatChange,
  volume,
  onVolumeChange,
  isMuted,
  onMuteChange,
}: {
  track: Track
  elapsed: number
  onSeek: (value: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  isLiked: boolean
  onLikeChange: (liked: boolean) => void
  isShuffling: boolean
  onShuffleChange: (shuffling: boolean) => void
  repeat: "off" | "all" | "one"
  onRepeatChange: () => void
  volume: number
  onVolumeChange: (value: number) => void
  isMuted: boolean
  onMuteChange: (muted: boolean) => void
}) {
  const VolumeIcon = isMuted
    ? VolumeOffIcon
    : volume < 50
      ? Volume1Icon
      : Volume2Icon

  return (
    <footer className="shrink-0 border-t bg-card px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <AlbumArt className="size-11" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{track.title}</span>
            <span className="truncate text-xs text-fg-muted">
              {track.artist}
            </span>
          </div>
          <ToggleButton
            variant="quiet"
            size="sm"
            isIconOnly
            isSelected={isLiked}
            onChange={onLikeChange}
            aria-label="Like this track"
            className="hidden sm:inline-flex"
          >
            <HeartIcon className={isLiked ? "fill-current" : undefined} />
          </ToggleButton>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ToggleButton
            variant="quiet"
            isIconOnly
            isSelected={isShuffling}
            onChange={onShuffleChange}
            aria-label="Shuffle"
            className="hidden sm:inline-flex"
          >
            <ShuffleIcon />
          </ToggleButton>
          <Tooltip>
            <Button
              variant="quiet"
              isIconOnly
              onPress={onPrevious}
              aria-label="Previous track"
            >
              <SkipBackIcon />
            </Button>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
          <Button
            variant="primary"
            size="lg"
            isIconOnly
            onPress={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Tooltip>
            <Button
              variant="quiet"
              isIconOnly
              onPress={onNext}
              aria-label="Next track"
            >
              <SkipForwardIcon />
            </Button>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
          <ToggleButton
            variant="quiet"
            isIconOnly
            isSelected={repeat !== "off"}
            onChange={onRepeatChange}
            aria-label={`Repeat: ${repeat}`}
            className="hidden sm:inline-flex"
          >
            <RepeatIcon one={repeat === "one"} />
          </ToggleButton>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-1 md:flex">
          <Menu>
            <Button variant="quiet" isIconOnly aria-label="Queue">
              <ListIcon />
            </Button>
            <Popover>
              <MenuContent>
                <MenuSection>
                  <MenuSectionHeader>Up next</MenuSectionHeader>
                  {TRACKS.slice(1, 4).map((next) => (
                    <MenuItem key={next.id}>
                      <MenuItemLabel>{next.title}</MenuItemLabel>
                      <MenuItemDescription>
                        {next.artist} · {formatTime(next.duration)}
                      </MenuItemDescription>
                    </MenuItem>
                  ))}
                </MenuSection>
              </MenuContent>
            </Popover>
          </Menu>
          <Button variant="quiet" isIconOnly aria-label="Lyrics">
            <MicIcon />
          </Button>
          <ToggleButton
            variant="quiet"
            isIconOnly
            isSelected={isMuted}
            onChange={onMuteChange}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <VolumeIcon />
          </ToggleButton>
          <Slider
            aria-label="Volume"
            value={isMuted ? 0 : volume}
            onChange={(value) => onVolumeChange(value as number)}
            className="w-24"
          >
            <SliderControl />
          </Slider>
          <Button variant="quiet" isIconOnly aria-label="Full screen player">
            <MaximizeIcon />
          </Button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="w-9 shrink-0 text-right font-mono text-xs text-fg-muted tabular-nums">
          {formatTime(elapsed)}
        </span>
        <Slider
          aria-label="Seek"
          value={elapsed}
          maxValue={track.duration}
          onChange={(value) => onSeek(value as number)}
          className="flex-1"
        >
          <SliderControl />
        </Slider>
        <span className="w-9 shrink-0 font-mono text-xs text-fg-muted tabular-nums">
          {formatTime(track.duration)}
        </span>
      </div>
    </footer>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function MusicPlayerBlock() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setPlaying] = useState(true)
  const [elapsed, setElapsed] = useState(74)
  const [volume, setVolume] = useState(68)
  const [isMuted, setMuted] = useState(false)
  const [isShuffling, setShuffling] = useState(true)
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("all")
  const [likedAlbum, setLikedAlbum] = useState(true)
  const [likedTrack, setLikedTrack] = useState(false)

  const track = TRACKS[currentIndex] ?? TRACKS[0]!

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setElapsed((value) => (value >= track.duration ? 0 : value + 1))
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, track.duration])

  const goTo = (index: number) => {
    setCurrentIndex((index + TRACKS.length) % TRACKS.length)
    setElapsed(0)
    setPlaying(true)
  }

  const selectTrack = (id: string) => {
    const index = TRACKS.findIndex((item) => item.id === id)
    if (index >= 0) goTo(index)
  }

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-bg text-fg">
      <SidebarProvider className="min-h-0 flex-1 overflow-hidden">
        <LibrarySidebar />
        <SidebarInset className="min-w-0 overflow-hidden">
          <TopBar />
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
              <Hero
                isLiked={likedAlbum}
                onLikeChange={setLikedAlbum}
                onPlay={() => goTo(0)}
              />
              <Tabs defaultSelectedKey="popular">
                <TabList aria-label="Artist sections">
                  <Tab id="popular">Popular</Tab>
                  <Tab id="albums">Albums</Tab>
                  <Tab id="about">About</Tab>
                </TabList>
                <TabPanel id="popular">
                  <TrackTable
                    currentId={track.id}
                    isPlaying={isPlaying}
                    onSelect={selectTrack}
                  />
                </TabPanel>
                <TabPanel id="albums">
                  <AlbumsGrid />
                </TabPanel>
                <TabPanel id="about">
                  <AboutPanel />
                </TabPanel>
              </Tabs>
              <div className="flex items-center gap-2 pb-2 text-sm text-fg-muted">
                <CircleDotIcon className="size-4" />
                <span>
                  Discography synced 8 minutes ago · 4 albums, 38 tracks
                </span>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <NowPlayingBar
        track={track}
        elapsed={elapsed}
        onSeek={setElapsed}
        isPlaying={isPlaying}
        onPlayPause={() => setPlaying((playing) => !playing)}
        onPrevious={() => goTo(currentIndex - 1)}
        onNext={() => goTo(currentIndex + 1)}
        isLiked={likedTrack}
        onLikeChange={setLikedTrack}
        isShuffling={isShuffling}
        onShuffleChange={setShuffling}
        repeat={repeat}
        onRepeatChange={() =>
          setRepeat((value) =>
            value === "off" ? "all" : value === "all" ? "one" : "off",
          )
        }
        volume={volume}
        onVolumeChange={(value) => {
          setVolume(value)
          setMuted(false)
        }}
        isMuted={isMuted}
        onMuteChange={setMuted}
      />
    </div>
  )
}
