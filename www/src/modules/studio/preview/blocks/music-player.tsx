import { useEffect, useState } from "react"

import {
  ClockIcon,
  DownloadIcon,
  HeartIcon,
  HomeIcon,
  LayoutGridIcon,
  ListIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  MusicIcon,
  PinIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Repeat1Icon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeOffIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "@/registry/ui/slider"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

// A Spotify-style desktop player: the library on the left, a playlist with
// its track list in the middle, the now-playing view on the right, and a
// player bar that really plays — progress, skip, shuffle, repeat, volume.

// Covers are drawn from the chart palette, so they follow the preset.
const COVER = [
  "bg-(--chart-1)",
  "bg-(--chart-2)",
  "bg-(--chart-3)",
  "bg-(--chart-4)",
  "bg-(--chart-5)",
]

const LIBRARY = [
  {
    id: "liked",
    title: "Liked Songs",
    subtitle: "Playlist · 412 songs",
    cover: 0,
    pinned: true,
  },
  {
    id: "focus",
    title: "Late Night Focus",
    subtitle: "Playlist · Erin",
    cover: 1,
    pinned: true,
  },
  {
    id: "aurora",
    title: "Aurora Lane",
    subtitle: "Artist",
    cover: 2,
    artist: true,
  },
  {
    id: "drive",
    title: "Coastal Drive",
    subtitle: "Playlist · Erin",
    cover: 3,
  },
  {
    id: "tides",
    title: "Tides & Tape",
    subtitle: "Album · The Low Hum",
    cover: 4,
  },
  {
    id: "morning",
    title: "Slow Mornings",
    subtitle: "Playlist · Northwind",
    cover: 0,
  },
  {
    id: "kai",
    title: "Kai Moreno",
    subtitle: "Artist",
    cover: 1,
    artist: true,
  },
  { id: "run", title: "Tempo Run", subtitle: "Playlist · Erin", cover: 2 },
]

interface Track {
  id: string
  title: string
  artist: string
  album: string
  added: string
  seconds: number
  cover: number
}

const TRACKS: Track[] = [
  {
    id: "t1",
    title: "Glass Harbor",
    artist: "Aurora Lane",
    album: "Night Ferries",
    added: "Oct 24, 2026",
    seconds: 214,
    cover: 2,
  },
  {
    id: "t2",
    title: "Low Light",
    artist: "The Low Hum",
    album: "Tides & Tape",
    added: "Oct 22, 2026",
    seconds: 247,
    cover: 4,
  },
  {
    id: "t3",
    title: "Paper Satellites",
    artist: "Kai Moreno",
    album: "Orbit Songs",
    added: "Oct 20, 2026",
    seconds: 193,
    cover: 1,
  },
  {
    id: "t4",
    title: "Northbound",
    artist: "Aurora Lane",
    album: "Night Ferries",
    added: "Oct 18, 2026",
    seconds: 268,
    cover: 2,
  },
  {
    id: "t5",
    title: "Soft Static",
    artist: "Mira Vale",
    album: "Soft Static",
    added: "Oct 15, 2026",
    seconds: 181,
    cover: 3,
  },
  {
    id: "t6",
    title: "Halftone",
    artist: "The Low Hum",
    album: "Tides & Tape",
    added: "Oct 11, 2026",
    seconds: 232,
    cover: 4,
  },
  {
    id: "t7",
    title: "Evening Bus",
    artist: "Kai Moreno",
    album: "Orbit Songs",
    added: "Oct 9, 2026",
    seconds: 205,
    cover: 1,
  },
  {
    id: "t8",
    title: "Undertow",
    artist: "Mira Vale",
    album: "Undertow",
    added: "Oct 2, 2026",
    seconds: 299,
    cover: 0,
  },
  {
    id: "t9",
    title: "Lantern Season",
    artist: "Aurora Lane",
    album: "Lantern Season",
    added: "Sep 28, 2026",
    seconds: 223,
    cover: 3,
  },
]

function time(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function Cover({
  index,
  className,
  round,
}: {
  index: number
  className?: string
  round?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center text-fg-on-primary/80",
        round ? "rounded-full" : "rounded-(--studio-radius-item)",
        COVER[index % COVER.length],
        className,
      )}
    >
      <MusicIcon className="size-[40%]" />
    </span>
  )
}

function Equalizer() {
  return (
    <span aria-label="Playing" className="flex h-3.5 items-end gap-0.5">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-0.5 animate-pulse rounded-full bg-primary"
          style={{
            height: `${[60, 100, 40][bar]}%`,
            animationDelay: `${bar * 150}ms`,
          }}
        />
      ))}
    </span>
  )
}

function IconButton({
  label,
  onPress,
  children,
  className,
}: {
  label: string
  onPress?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Tooltip>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={label}
        onPress={onPress}
        className={className}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function MusicPlayerBlock() {
  const [currentId, setCurrentId] = useState("t3")
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(71)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off")
  const [volume, setVolume] = useState(70)
  const [muted, setMuted] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set(["t1", "t3", "t8"]))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nowPlayingOpen, setNowPlayingOpen] = useState(true)
  const [filter, setFilter] = useState<"all" | "playlists" | "artists">("all")

  const index = TRACKS.findIndex((t) => t.id === currentId)
  const current = TRACKS[index] ?? TRACKS[0]
  const totalSeconds = TRACKS.reduce((sum, t) => sum + t.seconds, 0)

  const skip = (step: 1 | -1) => {
    if (step === -1 && position > 3) {
      setPosition(0)
      return
    }
    const next = shuffle
      ? Math.floor(Math.random() * TRACKS.length)
      : (index + step + TRACKS.length) % TRACKS.length
    setCurrentId(TRACKS[next]?.id ?? currentId)
    setPosition(0)
  }

  // A one-second clock drives playback; the end of a track honors repeat.
  useEffect(() => {
    if (!playing || !current) return
    const timer = setInterval(() => {
      setPosition((p) => {
        if (p + 1 < current.seconds) return p + 1
        if (repeat === "one") return 0
        if (repeat === "off" && index === TRACKS.length - 1) {
          setPlaying(false)
          return current.seconds
        }
        setCurrentId(TRACKS[(index + 1) % TRACKS.length]?.id ?? current.id)
        return 0
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [playing, current, index, repeat])

  const play = (id: string) => {
    if (id === currentId) {
      setPlaying((p) => !p)
      return
    }
    setCurrentId(id)
    setPosition(0)
    setPlaying(true)
  }
  const toggleLike = (id: string) =>
    setLiked((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  if (!current) return null
  const library = LIBRARY.filter((item) =>
    filter === "all" ? true : filter === "artists" ? item.artist : !item.artist,
  )

  return (
    <div className="flex h-svh min-h-svh flex-col gap-2 bg-bg p-2 text-fg">
      <header className="flex shrink-0 items-center gap-2 px-2">
        <BrandMark className="size-8">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-fg-on-primary">
            <MusicIcon className="size-4" />
          </span>
        </BrandMark>
        <span className="sr-only">
          <BrandName>Northwind</BrandName>
        </span>
        <div className="mx-auto flex w-full max-w-md items-center gap-2">
          <IconButton label="Home">
            <HomeIcon />
          </IconButton>
          <SearchField
            aria-label="Search"
            placeholder="What do you want to play?"
            className="w-full"
          />
        </div>
        <Avatar size="sm">
          <AvatarFallback>EC</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex min-h-0 flex-1 gap-2">
        {/* Library */}
        <aside
          aria-label="Your Library"
          className="hidden w-72 shrink-0 flex-col rounded-(--studio-radius-card) bg-muted/60 md:flex"
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold compact:text-xs">
              <LayoutGridIcon className="size-4 text-fg-muted" />
              Your Library
            </h2>
            <IconButton label="Create playlist">
              <PlusIcon />
            </IconButton>
          </div>
          <div className="flex gap-2 px-4 pt-2">
            {(
              [
                ["playlists", "Playlists"],
                ["artists", "Artists"],
              ] as const
            ).map(([id, label]) => (
              <ToggleButton
                key={id}
                size="sm"
                variant="secondary"
                isSelected={filter === id}
                onChange={(on) => setFilter(on ? id : "all")}
                className="rounded-full"
              >
                {label}
              </ToggleButton>
            ))}
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-2">
            {library.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={item.id === "focus" ? "page" : undefined}
                  className={cn(
                    "flex w-full cursor-interactive items-center gap-3 rounded-(--studio-radius-item) p-2 text-left",
                    item.id === "focus" ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  <Cover
                    index={item.cover}
                    round={item.artist}
                    className="size-12"
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-sm compact:text-xs",
                        item.id === "focus" && "text-primary",
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-fg-muted">
                      {item.pinned && (
                        <PinIcon className="mr-1 inline size-3 fill-current text-primary" />
                      )}
                      {item.subtitle}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Playlist */}
        <main className="min-w-0 flex-1 overflow-y-auto rounded-(--studio-radius-card) bg-muted/60">
          <div className="flex flex-col items-start gap-5 bg-linear-to-b from-(--chart-2)/35 to-transparent px-6 pt-10 pb-6 sm:flex-row sm:items-end">
            <Cover index={1} className="size-40 sm:size-48" />
            <div className="min-w-0">
              <p className="text-xs font-medium">Playlist</p>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">
                Late Night Focus
              </h1>
              <p className="mt-3 text-sm text-fg-muted compact:text-xs">
                Quiet, steady tracks for deep work after dark.
              </p>
              <p className="mt-1 text-sm compact:text-xs">
                <span className="font-medium">Erin Calloway</span>
                <span className="text-fg-muted">
                  {" "}
                  · {TRACKS.length} songs, {Math.round(totalSeconds / 60)} min
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <Button
              variant="primary"
              isIconOnly
              aria-label={playing ? "Pause" : "Play"}
              onPress={() => setPlaying((p) => !p)}
              className="rounded-full data-icon-only:size-14 [&_svg]:size-6"
            >
              {playing ? (
                <PauseIcon className="fill-current" />
              ) : (
                <PlayIcon className="fill-current" />
              )}
            </Button>
            <IconButton
              label={shuffle ? "Disable shuffle" : "Enable shuffle"}
              onPress={() => setShuffle((s) => !s)}
              className={cn(shuffle && "text-primary")}
            >
              <ShuffleIcon />
            </IconButton>
            <IconButton label="Download">
              <DownloadIcon />
            </IconButton>
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="More options"
              >
                <MoreHorizontalIcon />
              </Button>
              <Popover placement="bottom start">
                <MenuContent className="min-w-48">
                  <MenuItem>Add to queue</MenuItem>
                  <MenuItem>Edit details</MenuItem>
                  <MenuItem>Share</MenuItem>
                  <MenuItem variant="danger">Delete</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <span className="ml-auto flex items-center gap-1 text-sm text-fg-muted compact:text-xs">
              List
              <ListIcon className="size-4" />
            </span>
          </div>

          <div className="px-4 pb-6">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_2.5rem] gap-4 border-b px-2 pb-2 text-xs text-fg-muted md:grid-cols-[2rem_minmax(0,1.4fr)_minmax(0,1fr)_2.5rem_3rem] lg:grid-cols-[2rem_minmax(0,1.4fr)_minmax(0,1fr)_8rem_2.5rem_3rem]">
              <span className="text-right">#</span>
              <span>Title</span>
              <span className="max-md:hidden">Album</span>
              <span className="max-lg:hidden">Date added</span>
              <span className="max-md:hidden" />
              <ClockIcon
                aria-label="Duration"
                className="size-4 justify-self-end"
              />
            </div>
            <ol className="pt-2">
              {TRACKS.map((track, i) => {
                const isCurrent = track.id === currentId
                return (
                  <li key={track.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${track.title} by ${track.artist}`}
                      onClick={() => setSelectedId(track.id)}
                      onDoubleClick={() => play(track.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") play(track.id)
                      }}
                      className={cn(
                        "group/track grid cursor-interactive grid-cols-[2rem_minmax(0,1fr)_2.5rem] items-center gap-4 rounded-(--studio-radius-item) px-2 py-1.5 outline-none focus-visible:focus-ring md:grid-cols-[2rem_minmax(0,1.4fr)_minmax(0,1fr)_2.5rem_3rem] lg:grid-cols-[2rem_minmax(0,1.4fr)_minmax(0,1fr)_8rem_2.5rem_3rem]",
                        selectedId === track.id ? "bg-muted" : "hover:bg-muted",
                      )}
                    >
                      <span className="flex justify-end text-sm text-fg-muted tabular-nums compact:text-xs">
                        <span className="group-hover/track:hidden">
                          {isCurrent && playing ? (
                            <Equalizer />
                          ) : (
                            <span className={cn(isCurrent && "text-primary")}>
                              {i + 1}
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          aria-label={
                            isCurrent && playing
                              ? `Pause ${track.title}`
                              : `Play ${track.title}`
                          }
                          onClick={(event) => {
                            event.stopPropagation()
                            play(track.id)
                          }}
                          className="hidden cursor-interactive text-fg group-hover/track:flex"
                        >
                          {isCurrent && playing ? (
                            <PauseIcon className="size-4 fill-current" />
                          ) : (
                            <PlayIcon className="size-4 fill-current" />
                          )}
                        </button>
                      </span>
                      <span className="flex min-w-0 items-center gap-3">
                        <Cover index={track.cover} className="size-10" />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block truncate text-sm compact:text-xs",
                              isCurrent && "text-primary",
                            )}
                          >
                            {track.title}
                          </span>
                          <span className="block truncate text-xs text-fg-muted">
                            {track.artist}
                          </span>
                        </span>
                      </span>
                      <span className="truncate text-sm text-fg-muted max-md:hidden compact:text-xs">
                        {track.album}
                      </span>
                      <span className="text-sm text-fg-muted max-lg:hidden compact:text-xs">
                        {track.added}
                      </span>
                      <button
                        type="button"
                        aria-label={
                          liked.has(track.id)
                            ? "Remove from Liked Songs"
                            : "Save to Liked Songs"
                        }
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleLike(track.id)
                        }}
                        className={cn(
                          "flex cursor-interactive justify-center max-md:hidden",
                          liked.has(track.id)
                            ? "text-primary"
                            : "text-fg-muted opacity-0 group-hover/track:opacity-100 hover:text-fg",
                        )}
                      >
                        <HeartIcon
                          className={cn(
                            "size-4",
                            liked.has(track.id) && "fill-current",
                          )}
                        />
                      </button>
                      <span className="text-right text-sm text-fg-muted tabular-nums compact:text-xs">
                        {time(track.seconds)}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </main>

        {/* Now playing */}
        {nowPlayingOpen && (
          <aside
            aria-label="Now playing"
            className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-(--studio-radius-card) bg-muted/60 p-4 *:shrink-0 xl:flex"
          >
            <div className="flex items-center justify-between">
              <h2 className="truncate text-sm font-semibold compact:text-xs">
                Late Night Focus
              </h2>
              <IconButton
                label="Hide now playing view"
                onPress={() => setNowPlayingOpen(false)}
              >
                <XIcon />
              </IconButton>
            </div>
            <Cover index={current.cover} className="aspect-square w-full" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-heading text-xl font-bold">
                  {current.title}
                </p>
                <p className="truncate text-sm text-fg-muted compact:text-xs">
                  {current.artist}
                </p>
              </div>
              <IconButton
                label={
                  liked.has(current.id)
                    ? "Remove from Liked Songs"
                    : "Save to Liked Songs"
                }
                onPress={() => toggleLike(current.id)}
                className={cn(liked.has(current.id) && "text-primary")}
              >
                <HeartIcon
                  className={cn(liked.has(current.id) && "fill-current")}
                />
              </IconButton>
            </div>
            <div className="overflow-hidden rounded-(--studio-radius-card) bg-muted">
              <div
                className={cn(
                  "flex h-32 items-end p-3",
                  COVER[(current.cover + 2) % COVER.length],
                )}
              >
                <span className="text-sm font-semibold text-fg-on-primary">
                  About the artist
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium">{current.artist}</p>
                <p className="text-sm text-fg-muted compact:text-xs">
                  1,284,019 monthly listeners
                </p>
                <p className="mt-2 text-sm text-pretty text-fg-muted compact:text-xs">
                  Late-night songs built from tape loops, field recordings and a
                  very patient drum machine.
                </p>
              </div>
            </div>
            <div className="rounded-(--studio-radius-card) bg-muted p-3">
              <p className="pb-2 text-sm font-semibold compact:text-xs">
                Next in queue
              </p>
              {[1, 2].map((offset) => {
                const next = TRACKS[(index + offset) % TRACKS.length]
                if (!next) return null
                return (
                  <button
                    key={next.id}
                    type="button"
                    onClick={() => play(next.id)}
                    className="flex w-full cursor-interactive items-center gap-3 rounded-(--studio-radius-item) p-1.5 text-left hover:bg-bg/50"
                  >
                    <Cover index={next.cover} className="size-10" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm compact:text-xs">
                        {next.title}
                      </span>
                      <span className="block truncate text-xs text-fg-muted">
                        {next.artist}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Player bar */}
      <footer className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-2 py-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-3">
          <Cover index={current.cover} className="size-14" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium compact:text-xs">
              {current.title}
            </p>
            <p className="truncate text-xs text-fg-muted">{current.artist}</p>
          </div>
          <IconButton
            label={
              liked.has(current.id)
                ? "Remove from Liked Songs"
                : "Save to Liked Songs"
            }
            onPress={() => toggleLike(current.id)}
            className={cn(
              "max-sm:hidden",
              liked.has(current.id) && "text-primary",
            )}
          >
            <HeartIcon
              className={cn(liked.has(current.id) && "fill-current")}
            />
          </IconButton>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <IconButton
              label={shuffle ? "Disable shuffle" : "Enable shuffle"}
              onPress={() => setShuffle((s) => !s)}
              className={cn("max-sm:hidden", shuffle && "text-primary")}
            >
              <ShuffleIcon />
            </IconButton>
            <IconButton label="Previous" onPress={() => skip(-1)}>
              <SkipBackIcon className="fill-current" />
            </IconButton>
            <Button
              variant="secondary"
              isIconOnly
              aria-label={playing ? "Pause" : "Play"}
              onPress={() => setPlaying((p) => !p)}
              className="rounded-full data-icon-only:size-9"
            >
              {playing ? (
                <PauseIcon className="fill-current" />
              ) : (
                <PlayIcon className="fill-current" />
              )}
            </Button>
            <IconButton label="Next" onPress={() => skip(1)}>
              <SkipForwardIcon className="fill-current" />
            </IconButton>
            <IconButton
              label={
                repeat === "off"
                  ? "Enable repeat"
                  : repeat === "all"
                    ? "Enable repeat one"
                    : "Disable repeat"
              }
              onPress={() =>
                setRepeat((r) =>
                  r === "off" ? "all" : r === "all" ? "one" : "off",
                )
              }
              className={cn(
                "max-sm:hidden",
                repeat !== "off" && "text-primary",
              )}
            >
              {repeat === "one" ? <Repeat1Icon /> : <RepeatIcon />}
            </IconButton>
          </div>
          <div className="flex w-full max-w-xl items-center gap-2 text-xs text-fg-muted tabular-nums max-md:hidden">
            <span className="w-10 text-right">{time(position)}</span>
            <Slider
              aria-label="Seek"
              value={position}
              maxValue={current.seconds}
              onChange={(value) =>
                setPosition(Array.isArray(value) ? (value[0] ?? 0) : value)
              }
              className="flex-1"
            >
              <SliderControl>
                <SliderTrack>
                  <SliderFill />
                </SliderTrack>
                <SliderThumb />
              </SliderControl>
            </Slider>
            <span className="w-10">{time(current.seconds)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-1 md:flex">
          <IconButton
            label={
              nowPlayingOpen ? "Hide now playing view" : "Show now playing view"
            }
            onPress={() => setNowPlayingOpen((o) => !o)}
            className={cn("max-xl:hidden", nowPlayingOpen && "text-primary")}
          >
            <MonitorIcon />
          </IconButton>
          <IconButton
            label={muted ? "Unmute" : "Mute"}
            onPress={() => setMuted((m) => !m)}
          >
            {muted || volume === 0 ? <VolumeOffIcon /> : <Volume2Icon />}
          </IconButton>
          <Slider
            aria-label="Volume"
            value={muted ? 0 : volume}
            onChange={(value) => {
              setVolume(Array.isArray(value) ? (value[0] ?? 0) : value)
              setMuted(false)
            }}
            className="w-28"
          >
            <SliderControl>
              <SliderTrack>
                <SliderFill />
              </SliderTrack>
              <SliderThumb />
            </SliderControl>
          </Slider>
        </div>
      </footer>
    </div>
  )
}
