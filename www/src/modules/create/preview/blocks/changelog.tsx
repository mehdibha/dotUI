import { useMemo, useState } from "react"

import {
  CircleCheckIcon,
  HeartIcon,
  ImageIcon,
  LayersIcon,
  LinkIcon,
  MailIcon,
  MenuIcon,
  RadioIcon,
  SparklesIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Accordion } from "@/registry/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Link } from "@/registry/ui/link"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type Category = "new" | "improved" | "fixed"

interface Change {
  category: Category
  text: string
}

interface Release {
  version: string
  date: string
  title: string
  summary: string
  contributors: string[]
  commits: number
  reactions: number
  changes: Change[]
  feature?: string
}

const CATEGORIES: Record<
  Category,
  {
    label: string
    variant: "success" | "accent" | "warning"
    icon: typeof ZapIcon
  }
> = {
  new: { label: "New", variant: "success", icon: SparklesIcon },
  improved: { label: "Improved", variant: "accent", icon: ZapIcon },
  fixed: { label: "Fixed", variant: "warning", icon: CircleCheckIcon },
}

const CATEGORY_ORDER: Category[] = ["new", "improved", "fixed"]

const NAV = ["Product", "Docs", "Pricing", "Changelog"]

const releases: Release[] = [
  {
    version: "4.6.0",
    date: "March 12, 2026",
    title: "Realtime collaboration in the flow editor",
    summary:
      "Two people can now build the same flow at the same time. Presence, cursors and comment threads land on the canvas, and the renderer was rewritten to keep up with them.",
    feature:
      "Multiplayer cursors and pinned comment threads on the flow canvas",
    contributors: [
      "Amara Osei",
      "Ravi Menon",
      "Jonas Weber",
      "Lena Fischer",
      "Tomas Alvarez",
    ],
    commits: 38,
    reactions: 214,
    changes: [
      {
        category: "new",
        text: "Live presence and cursors for everyone editing a flow",
      },
      {
        category: "new",
        text: "Comment threads pinned to any node, with mentions and resolve",
      },
      {
        category: "new",
        text: "meridian run --watch re-runs a flow whenever a step file changes",
      },
      {
        category: "improved",
        text: "The canvas holds 60fps at 10,000 nodes, up from roughly 1,200",
      },
      {
        category: "improved",
        text: "Run history opens 3.4× faster in workspaces past 50,000 runs",
      },
      {
        category: "improved",
        text: "Step search matches description text, not just the step name",
      },
      {
        category: "fixed",
        text: "Webhook triggers no longer drop payloads larger than 2 MB",
      },
      {
        category: "fixed",
        text: "Undo after deleting a connected group restores its edges",
      },
    ],
  },
  {
    version: "4.5.2",
    date: "February 26, 2026",
    title: "Timezone-safe schedules",
    summary:
      "A patch release for teams running flows across regions — schedules now anchor to the workspace timezone instead of UTC.",
    contributors: ["Ravi Menon", "Priya Raman"],
    commits: 9,
    reactions: 63,
    changes: [
      {
        category: "improved",
        text: "The schedule editor previews the next five runs in your local time",
      },
      {
        category: "fixed",
        text: "Daily schedules no longer skip a run on the day the clock shifts",
      },
      {
        category: "fixed",
        text: "Retries respect the flow-level timeout instead of the global default",
      },
      {
        category: "fixed",
        text: "CSV export keeps the leading zeros on run IDs",
      },
    ],
  },
  {
    version: "4.5.0",
    date: "February 9, 2026",
    title: "Secrets, scoped per environment",
    summary:
      "Secrets get their own home. Store one once, scope it to staging or production, and rotate it without touching a single flow.",
    contributors: ["Lena Fischer", "Diego Moreau", "Amara Osei"],
    commits: 27,
    reactions: 148,
    changes: [
      {
        category: "new",
        text: "Environment-scoped secrets with per-flow access rules",
      },
      {
        category: "new",
        text: "An audit log entry for every secret read, kept for 90 days",
      },
      {
        category: "new",
        text: "Rotate a secret in place — running flows pick it up on the next step",
      },
      {
        category: "improved",
        text: "The environment switcher moved into the workspace header",
      },
      {
        category: "fixed",
        text: "Secrets are no longer rendered in plain text in exported run logs",
      },
    ],
  },
  {
    version: "4.4.0",
    date: "January 21, 2026",
    title: "Python steps are generally available",
    summary:
      "After four months in preview, Python steps ship with pinned dependencies, a warm runtime, and the same logs and retries as every other step.",
    contributors: ["Tomas Alvarez", "Priya Raman", "Jonas Weber"],
    commits: 41,
    reactions: 302,
    changes: [
      {
        category: "new",
        text: "Python 3.12 steps with a requirements.txt per flow",
      },
      {
        category: "new",
        text: "Warm containers cut cold starts from 2.1s down to 240ms",
      },
      {
        category: "improved",
        text: "Structured logs stream while a step is still running",
      },
      {
        category: "improved",
        text: "The step editor keeps syntax highlighting in split view",
      },
      {
        category: "fixed",
        text: "Long-running Python steps no longer time out at exactly 15 minutes",
      },
    ],
  },
]

const archive = [
  {
    version: "4.3.1",
    date: "December 18, 2025",
    summary:
      "Nine fixes across the run inspector, plus a workspace switcher that no longer refetches on every open.",
  },
  {
    version: "4.3.0",
    date: "December 2, 2025",
    summary:
      "The run inspector was rebuilt around a timeline view, with per-step input and output diffing.",
  },
  {
    version: "4.2.0",
    date: "November 14, 2025",
    summary:
      "Branch conditions, a rewritten HTTP step, and the first pass at shareable flow templates.",
  },
]

// Avatars in a group overlap, so a two-letter fallback would be half-covered.
function initial(name: string) {
  return name.charAt(0)
}

function ChangeList({
  category,
  items,
}: {
  category: Category
  items: string[]
}) {
  const { label, variant, icon: Icon } = CATEGORIES[category]
  return (
    <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
      <div className="flex">
        <Badge variant={variant} appearance="subtle" className="sm:mt-0.5">
          <Icon />
          {label}
        </Badge>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-pretty">
            <span
              aria-hidden
              className="mt-2 size-1 shrink-0 rounded-full bg-fg-muted"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReleaseEntry({
  release,
  isLatest,
  isLast,
  isLiked,
  onLike,
}: {
  release: Release
  isLatest: boolean
  isLast: boolean
  isLiked: boolean
  onLike: (liked: boolean) => void
}) {
  const shown = CATEGORY_ORDER.map((category) => ({
    category,
    items: release.changes
      .filter((change) => change.category === category)
      .map((change) => change.text),
  })).filter((group) => group.items.length > 0)

  const visible = release.contributors.slice(0, 3)
  const overflow = release.contributors.length - visible.length

  return (
    <li className={cn("relative pl-7 sm:pl-10", isLast ? "pb-0" : "pb-14")}>
      <span
        aria-hidden
        className={cn(
          "absolute top-4 left-[3.5px] w-px bg-border sm:left-[5.5px]",
          isLast ? "h-0" : "bottom-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute top-1.5 left-0 size-2 rounded-full sm:size-3",
          isLatest ? "bg-primary" : "bg-border-control",
        )}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge appearance="subtle" className="font-mono">
          v{release.version}
        </Badge>
        <span className="text-sm text-fg-muted">{release.date}</span>
        {isLatest && <Badge variant="success">Latest</Badge>}
      </div>

      <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {release.title}
      </h2>
      <p className="mt-2 max-w-prose text-pretty text-fg-muted">
        {release.summary}
      </p>

      {release.feature && (
        <figure className="mt-6 overflow-hidden rounded-xl border">
          <div className="flex aspect-[16/9] items-center justify-center bg-muted">
            <span className="flex size-12 items-center justify-center rounded-lg border bg-bg text-fg-muted">
              <ImageIcon className="size-5" />
            </span>
          </div>
          <figcaption className="border-t bg-card px-4 py-3 text-xs text-fg-muted">
            {release.feature}
          </figcaption>
        </figure>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {shown.map((group) => (
          <ChangeList
            key={group.category}
            category={group.category}
            items={group.items}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <AvatarGroup size="sm">
          {visible.map((name) => (
            <Avatar key={name} size="sm">
              <AvatarFallback>{initial(name)}</AvatarFallback>
            </Avatar>
          ))}
          {overflow > 0 && <AvatarGroupCount>+{overflow}</AvatarGroupCount>}
        </AvatarGroup>
        <span className="text-sm text-fg-muted">
          {release.contributors.length} contributors · {release.commits} commits
        </span>
        <div className="ml-auto flex items-center gap-1">
          <ToggleButton
            size="sm"
            variant="quiet"
            isSelected={isLiked}
            onChange={onLike}
            aria-label={`React to ${release.title}`}
          >
            <HeartIcon />
            {release.reactions + (isLiked ? 1 : 0)}
          </ToggleButton>
          <Tooltip>
            <Button size="sm" variant="quiet" isIconOnly aria-label="Copy link">
              <LinkIcon />
            </Button>
            <TooltipContent>Copy link to v{release.version}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </li>
  )
}

function Subscribe() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  if (subscribed) {
    return (
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>You're on the list</AlertTitle>
        <AlertDescription>
          We'll send {email} a short note whenever Meridian ships a release.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (email.trim()) setSubscribed(true)
      }}
    >
      <TextField
        aria-label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        className="w-full"
      >
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="you@company.com" />
          <InputGroupAddon>
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
      <p className="text-xs text-fg-muted">
        One email per release. No digests, no marketing.
      </p>
    </form>
  )
}

export default function ChangelogBlock() {
  const [filter, setFilter] = useState<Category | "all">("all")
  const [query, setQuery] = useState("")
  const [liked, setLiked] = useState<string[]>([])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return releases
      .map((release) => ({
        ...release,
        changes: release.changes.filter((change) => {
          if (filter !== "all" && change.category !== filter) return false
          if (!needle) return true
          return (
            change.text.toLowerCase().includes(needle) ||
            release.title.toLowerCase().includes(needle) ||
            release.version.includes(needle)
          )
        }),
      }))
      .filter((release) => release.changes.length > 0)
  }, [filter, query])

  const totalChanges = filtered.reduce(
    (sum, release) => sum + release.changes.length,
    0,
  )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <LayersIcon className="size-4" />
            </span>
            <span className="font-heading font-semibold tracking-tight">
              Meridian
            </span>
          </div>
          <nav className="ml-4 hidden items-center gap-5 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item}
                href="#"
                className={cn(
                  "text-sm no-underline",
                  item === "Changelog" ? "text-fg" : "text-fg-muted",
                )}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="quiet" className="hidden sm:inline-flex">
              <RadioIcon />
              RSS
            </Button>
            <Button size="sm" variant="primary">
              Sign in
            </Button>
            <Menu>
              <Button
                size="sm"
                isIconOnly
                aria-label="Menu"
                className="sm:hidden"
              >
                <MenuIcon />
              </Button>
              <Popover>
                <MenuContent>
                  {NAV.map((item) => (
                    <MenuItem key={item}>{item}</MenuItem>
                  ))}
                  <MenuItem>RSS feed</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-fg-muted uppercase">
              Changelog
            </span>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Every release, in order
            </h1>
            <p className="max-w-xl text-pretty text-fg-muted">
              What shipped in Meridian — new capability, faster paths through
              the product, and the bugs we closed on the way.
            </p>
          </div>
          <Subscribe />
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl
            aria-label="Filter changes by type"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const [key] = [...keys]
              if (key) setFilter(key as Category | "all")
            }}
          >
            <SegmentedControlItem id="all">All</SegmentedControlItem>
            <SegmentedControlItem id="new">New</SegmentedControlItem>
            <SegmentedControlItem id="improved">Improved</SegmentedControlItem>
            <SegmentedControlItem id="fixed">Fixed</SegmentedControlItem>
          </SegmentedControl>
          <SearchField
            aria-label="Search the changelog"
            placeholder="Search releases"
            value={query}
            onChange={setQuery}
            className="sm:w-56"
          />
        </div>

        <p className="mt-4 text-sm text-fg-muted">
          {totalChanges} {totalChanges === 1 ? "change" : "changes"} across{" "}
          {filtered.length} {filtered.length === 1 ? "release" : "releases"}
        </p>

        {filtered.length > 0 ? (
          <ol className="mt-10 flex flex-col">
            {filtered.map((release, index) => (
              <ReleaseEntry
                key={release.version}
                release={release}
                isLatest={release.version === releases[0]?.version}
                isLast={index === filtered.length - 1}
                isLiked={liked.includes(release.version)}
                onLike={(isLiked) =>
                  setLiked((current) =>
                    isLiked
                      ? [...current, release.version]
                      : current.filter((v) => v !== release.version),
                  )
                }
              />
            ))}
          </ol>
        ) : (
          <Empty className="mt-10 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SparklesIcon />
              </EmptyMedia>
              <EmptyTitle>Nothing matches that</EmptyTitle>
              <EmptyDescription>
                No release in the last year mentions “{query.trim()}”. Try a
                shorter term, or clear the type filter.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="secondary"
                onPress={() => {
                  setQuery("")
                  setFilter("all")
                }}
              >
                Reset filters
              </Button>
            </EmptyContent>
          </Empty>
        )}

        <Separator className="my-12" />

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Earlier releases
          </h2>
          <Accordion>
            {archive.map((entry) => (
              <Disclosure key={entry.version} id={entry.version}>
                <DisclosureTrigger>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm">v{entry.version}</span>
                    <span className="text-sm font-normal text-fg-muted">
                      {entry.date}
                    </span>
                  </span>
                </DisclosureTrigger>
                <DisclosurePanel>
                  <p className="text-pretty text-fg-muted">{entry.summary}</p>
                  <Link href="#" className="mt-3 inline-block text-sm">
                    Read the full notes
                  </Link>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-sm text-fg-muted">
            © 2026 Meridian Labs · Shipping since 2021
          </span>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-fg-muted no-underline">
              Status
            </Link>
            <Link href="#" className="text-sm text-fg-muted no-underline">
              Docs
            </Link>
            <Link href="#" className="text-sm text-fg-muted no-underline">
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
