"use client"

import { type ReactNode, useEffect, useState } from "react"

import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  HeartIcon,
  ImageIcon,
  LightbulbIcon,
  LinkIcon,
  MailIcon,
  MessageSquareIcon,
  ShareIcon,
  TrendingDownIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Link } from "@/registry/ui/link"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { ProgressBar, ProgressBarTrack } from "@/registry/ui/progress-bar"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/* A long-form editorial page: the design system judged on running prose, not
   just on controls — type scale, measure, code, callouts and card furniture. */

const SECTIONS: { id: string; label: string; nested?: boolean }[] = [
  { id: "why", label: "Why last-write-wins broke" },
  { id: "model", label: "Modelling a document" },
  { id: "merge", label: "Picking a merge strategy", nested: true },
  { id: "tombstones", label: "The tombstone problem", nested: true },
  { id: "rollout", label: "Rolling out without downtime" },
  { id: "results", label: "What the numbers say" },
  { id: "next", label: "What's next" },
]

const TAGS = ["Distributed systems", "CRDT", "Postgres", "Sync"]

const STATS = [
  { label: "p95 merge latency", value: "41ms", delta: "from 340ms" },
  { label: "Conflict tickets", value: "18/mo", delta: "from 1,240/mo" },
  { label: "Update payload", value: "−62%", delta: "median document" },
]

const READ_NEXT = [
  {
    topic: "Engineering",
    title: "Designing an offline-first mobile client",
    excerpt:
      "What changes when the network is a suggestion rather than a guarantee — and why the queue is the hard part.",
    author: "Tomas Feld",
    read: "9 min read",
  },
  {
    topic: "Performance",
    title: "Cutting cold starts by 71%",
    excerpt:
      "A boring story about bundle graphs, connection pools and one very expensive import statement.",
    author: "Priya Raghunathan",
    read: "7 min read",
  },
  {
    topic: "Culture",
    title: "The anatomy of a good incident review",
    excerpt:
      "Blameless is table stakes. The reviews that actually change systems share four other properties.",
    author: "Nadia Okonkwo",
    read: "6 min read",
  },
]

const MERGE_TS = `import { type Doc, mergeUpdates } from "@meridian/crdt"

export function applyRemote(doc: Doc, update: Uint8Array): Doc {
  const merged = mergeUpdates(doc.state, update)

  // Nothing new for us in this update — skip the commit entirely.
  if (merged.version === doc.version) return doc

  return doc.commit(merged, { origin: "remote", at: Date.now() })
}`

const MIGRATION_SQL = `ALTER TABLE documents
  ADD COLUMN crdt_state   BYTEA,
  ADD COLUMN crdt_version BIGINT NOT NULL DEFAULT 0;

CREATE INDEX CONCURRENTLY documents_crdt_version_idx
  ON documents (workspace_id, crdt_version DESC);

-- Backfill in 5k batches; the shadow writer keeps both columns honest.
UPDATE documents SET crdt_state = encode_legacy(body)
  WHERE crdt_state IS NULL LIMIT 5000;`

/* ------------------------------- Primitives ------------------------------- */

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 scroll-mt-24 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
    >
      {children}
    </h2>
  )
}

function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-8 scroll-mt-24 font-heading text-lg font-semibold tracking-tight sm:text-xl"
    >
      {children}
    </h3>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-[1.0625rem]/8 text-pretty">{children}</p>
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
      {children}
    </code>
  )
}

function Figure({ caption }: { caption: string }) {
  return (
    <figure className="mt-8 flex flex-col gap-2">
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl border bg-muted">
        <ImageIcon className="size-8 text-fg-muted" />
      </div>
      <figcaption className="text-sm text-fg-muted">{caption}</figcaption>
    </figure>
  )
}

function MetaDot() {
  return <span className="text-fg-muted">·</span>
}

/* --------------------------------- Chrome --------------------------------- */

function SiteHeader({
  progress,
  saved,
  onSavedChange,
}: {
  progress: number
  saved: boolean
  onSavedChange: (v: boolean) => void
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
            <BookOpenIcon className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight">
            Meridian
          </span>
          <Badge size="sm" className="hidden sm:inline-flex">
            Engineering blog
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Tooltip>
            <ToggleButton
              variant="quiet"
              isIconOnly
              aria-label="Save article"
              isSelected={saved}
              onChange={onSavedChange}
            >
              <BookmarkIcon />
            </ToggleButton>
            <TooltipContent>
              {saved ? "Saved" : "Save for later"}
            </TooltipContent>
          </Tooltip>
          <Menu>
            <Button variant="quiet" isIconOnly aria-label="Share article">
              <ShareIcon />
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>
                  <LinkIcon />
                  Copy link
                </MenuItem>
                <MenuItem>
                  <MessageSquareIcon />
                  Post to feed
                </MenuItem>
                <MenuItem>
                  <MailIcon />
                  Email to a colleague
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
          <Button variant="primary" size="sm">
            Subscribe
          </Button>
        </div>
      </div>
      <ProgressBar
        value={progress}
        aria-label="Reading progress"
        className="absolute inset-x-0 -bottom-px gap-0"
      >
        <ProgressBarTrack className="h-0.5 rounded-none bg-transparent" />
      </ProgressBar>
    </header>
  )
}

function ArticleHeader() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Blog</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Engineering</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent" appearance="subtle" size="lg">
          Engineering
        </Badge>
        <Badge size="lg">Deep dive</Badge>
      </div>

      <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Rebuilding Meridian's sync engine on CRDTs
      </h1>

      <p className="max-w-2xl text-lg/8 text-pretty text-fg-muted">
        Six months, 40 million documents and one very patient migration script.
        Here is how we replaced last-write-wins with a conflict-free replicated
        data type — and what it cost us along the way.
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fg-muted">
        <div className="flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>NO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-fg">Nadia Okonkwo</span>
            <span className="text-xs">Staff Engineer, Sync</span>
          </div>
        </div>
        <Separator orientation="vertical" className="hidden h-8 sm:block" />
        <span>August 14, 2026</span>
        <MetaDot />
        <span className="flex items-center gap-1">
          <ClockIcon className="size-3.5" />
          12 min read
        </span>
        <MetaDot />
        <span>4,812 reads</span>
      </div>
    </div>
  )
}

/* ------------------------------- Article body ------------------------------ */

function CodeSample() {
  return (
    <Card className="mt-8 gap-0 overflow-hidden py-0">
      <Tabs defaultSelectedKey="merge">
        <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
          <TabList variant="line" aria-label="Source files">
            <Tab id="merge">merge.ts</Tab>
            <Tab id="migration">migration.sql</Tab>
          </TabList>
          <Tooltip>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Copy code">
              <CopyIcon />
            </Button>
            <TooltipContent>Copy snippet</TooltipContent>
          </Tooltip>
        </div>
        <TabPanel id="merge" className="overflow-x-auto">
          <pre className="p-4 font-mono text-xs/6 whitespace-pre">
            {MERGE_TS}
          </pre>
        </TabPanel>
        <TabPanel id="migration" className="overflow-x-auto">
          <pre className="p-4 font-mono text-xs/6 whitespace-pre">
            {MIGRATION_SQL}
          </pre>
        </TabPanel>
      </Tabs>
    </Card>
  )
}

function ArticleBody() {
  return (
    <div className="max-w-2xl">
      <P>
        Meridian started as a document editor for two people in the same room.
        The first sync implementation reflected that: every save shipped the
        whole document, the server compared a <Code>updated_at</Code> timestamp,
        and the newest write won. It was three hundred lines of code and it held
        for four years.
      </P>

      <H2 id="why">Why last-write-wins broke</H2>
      <P>
        Last-write-wins is not a merge strategy, it is a coin flip with extra
        steps. It works while edits are rare and sessions are short. By the end
        of 2025 the median Meridian workspace had eleven active editors, mobile
        clients that stayed offline for hours, and automations writing through
        the API at the same time as humans typed.
      </P>
      <P>
        Support saw the result before we did: roughly 1,240 tickets a month that
        all said some version of the same sentence.
      </P>

      <blockquote className="mt-8 border-l-2 border-primary pl-5 font-heading text-xl/8 text-pretty italic">
        “I wrote three paragraphs on the train, my colleague fixed a typo from
        her desk, and when I reconnected my paragraphs were simply gone.”
        <footer className="mt-3 font-sans text-sm text-fg-muted not-italic">
          — Recurring report, Q4 2025 support review
        </footer>
      </blockquote>

      <H2 id="model">Modelling a document</H2>
      <P>
        A CRDT replaces the coin flip with an algebra. Every replica can apply
        every update in any order and still land on the same state, because the
        merge function is commutative, associative and idempotent. The cost is
        that you stop storing a document and start storing its history.
      </P>

      <H3 id="merge">Picking a merge strategy</H3>
      <P>
        We evaluated four families against a corpus of 40 million real
        documents, scoring each on merge cost, payload size and how badly it
        surprised a human reader:
      </P>
      <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 text-[1.0625rem]/8 marker:text-fg-muted">
        <li>
          <strong className="font-medium">Operational transforms</strong> —
          smallest payloads, but the server has to stay authoritative, which
          rules out offline-first.
        </li>
        <li>
          <strong className="font-medium">State-based CRDTs</strong> — trivially
          correct, far too large to ship over a mobile connection.
        </li>
        <li>
          <strong className="font-medium">Operation-based CRDTs</strong> — the
          balance we picked, once we accepted a causal delivery guarantee.
        </li>
        <li>
          <strong className="font-medium">Server-side rebase</strong> — cheap to
          build, and it reintroduces exactly the data loss we were removing.
        </li>
      </ul>

      <Alert variant="info" className="mt-8">
        <LightbulbIcon />
        <AlertTitle>Causal delivery is a product decision</AlertTitle>
        <AlertDescription>
          Requiring updates to arrive after their dependencies means a dropped
          packet stalls a document rather than corrupting it. We would take that
          trade again — a spinner is recoverable, a lost paragraph is not.
        </AlertDescription>
      </Alert>

      <H3 id="tombstones">The tombstone problem</H3>
      <P>
        Deletions in an operation-based CRDT are not deletions, they are
        tombstones. A document that has been heavily edited for two years can
        carry more tombstones than live characters, and <Code>doc.state</Code>{" "}
        grows monotonically until something garbage-collects it. Our compaction
        pass runs when a document has been idle for ten minutes and every
        connected replica has acknowledged the same version.
      </P>

      <Figure caption="Figure 1 — update flow after the rewrite: clients merge locally, then reconcile through the causal log." />

      <H2 id="rollout">Rolling out without downtime</H2>
      <P>
        The migration ran for eleven weeks behind a shadow writer: both engines
        received every write, only the legacy engine answered reads, and a
        differ compared their outputs on a one-percent sample. Twenty-three
        divergences turned up. Nineteen were bugs in the new engine, four were
        bugs in the old one.
      </P>
      <CodeSample />
      <P>
        Reads flipped workspace by workspace, ordered by document count
        ascending, with an instant rollback switch that we used exactly twice.
      </P>

      <H2 id="results">What the numbers say</H2>
      <P>
        Ninety days after the last workspace moved across, the picture is
        boring, which is the goal:
      </P>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                {stat.label}
              </span>
              <span className="font-heading text-2xl font-semibold tabular-nums">
                {stat.value}
              </span>
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <TrendingDownIcon className="size-3" />
                {stat.delta}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <H2 id="next">What's next</H2>
      <P>
        Comments and cursors still travel on the old presence channel, so they
        can disagree with the document they annotate. Folding them into the same
        causal log is the next project, and it should let us delete the last
        piece of the 2021 sync stack.
      </P>
    </div>
  )
}

/* --------------------------------- Aside ---------------------------------- */

function TableOfContents({ active }: { active: string }) {
  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
        On this page
      </span>
      <ul className="flex flex-col">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <Link
              variant="unstyled"
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={cn(
                "py-1 text-sm text-fg-muted transition-colors hover:text-fg",
                active === section.id && "text-fg",
                section.nested && "pl-3",
              )}
            >
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ShareRail({
  copied,
  onCopy,
}: {
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">
        Share
      </span>
      <div className="flex gap-1.5">
        <Tooltip>
          <Button
            variant="secondary"
            isIconOnly
            aria-label="Copy link"
            onPress={onCopy}
          >
            {copied ? <CheckIcon /> : <LinkIcon />}
          </Button>
          <TooltipContent>
            {copied ? "Link copied" : "Copy link"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button variant="secondary" isIconOnly aria-label="Post to feed">
            <MessageSquareIcon />
          </Button>
          <TooltipContent>Post to feed</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button variant="secondary" isIconOnly aria-label="Email article">
            <MailIcon />
          </Button>
          <TooltipContent>Email article</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function NewsletterCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>The Meridian dispatch</CardTitle>
        <CardDescription>
          One engineering write-up a month. No release notes, no launches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField type="email" autoComplete="email" aria-label="Email">
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <Input placeholder="you@company.com" />
            </InputGroup>
          </TextField>
          <Button type="submit" variant="primary" className="w-full">
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

/* --------------------------------- Footer --------------------------------- */

function Engagement({
  liked,
  onLikedChange,
  saved,
  onSavedChange,
  copied,
  onCopy,
}: {
  liked: boolean
  onLikedChange: (v: boolean) => void
  saved: boolean
  onSavedChange: (v: boolean) => void
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleButton isSelected={liked} onChange={onLikedChange}>
        <HeartIcon />
        {liked ? "129" : "128"}
      </ToggleButton>
      <ToggleButton isSelected={saved} onChange={onSavedChange}>
        <BookmarkIcon />
        {saved ? "Saved" : "Save"}
      </ToggleButton>
      <Button variant="secondary">
        <MessageSquareIcon />
        24 comments
      </Button>
      <Button variant="quiet" onPress={onCopy} className="sm:ml-auto">
        {copied ? <CheckIcon /> : <LinkIcon />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
    </div>
  )
}

function AuthorCard({
  following,
  onFollowingChange,
}: {
  following: boolean
  onFollowingChange: (v: boolean) => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Avatar size="lg" className="size-14">
          <AvatarFallback className="text-lg">NO</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold">
              Nadia Okonkwo
            </span>
            <span className="text-sm text-fg-muted">
              Staff Engineer, Sync · 14 posts
            </span>
          </div>
          <p className="text-sm text-pretty text-fg-muted">
            Works on distributed state at Meridian. Previously built
            collaborative editors at Halden and Fieldnote. Writes about
            replication, occasionally about bread.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ToggleButton
            variant="primary"
            isSelected={following}
            onChange={onFollowingChange}
          >
            {following ? "Following" : "Follow"}
          </ToggleButton>
          <Button variant="secondary">All posts</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ReadNext() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Read next
        </h2>
        <Button variant="quiet" size="sm">
          All articles
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {READ_NEXT.map((post) => (
          <Card key={post.title} className="overflow-hidden pt-0">
            <div className="flex aspect-[16/9] items-center justify-center border-b bg-muted">
              <ImageIcon className="size-6 text-fg-muted" />
            </div>
            <CardHeader>
              <Badge size="sm" className="mb-2 w-fit justify-self-start">
                {post.topic}
              </Badge>
              <CardTitle className="text-pretty">{post.title}</CardTitle>
              <CardDescription className="text-pretty">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2 border-t text-xs text-fg-muted">
              <Avatar size="sm">
                <AvatarFallback className="text-[0.625rem]">
                  {post.author
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{post.author}</span>
              <MetaDot />
              <span className="shrink-0">{post.read}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function BlogArticle() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(SECTIONS[0]?.id ?? "")
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [following, setFollowing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(
        max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0,
      )
      let current = SECTIONS[0]?.id ?? ""
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= 120) current = section.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyLink = () => {
    // The clipboard is unavailable inside a cross-origin preview — ignore it.
    navigator.clipboard
      ?.writeText("https://meridian.dev/blog/crdt-sync-engine")
      .catch(() => {})
    setCopied(true)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader progress={progress} saved={saved} onSavedChange={setSaved} />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <ArticleHeader />

        <div className="mt-10 flex aspect-[16/8] items-center justify-center rounded-2xl border bg-muted">
          <ImageIcon className="size-10 text-fg-muted" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0">
            <ArticleBody />

            <div className="mt-12 max-w-2xl">
              <TagGroup>
                <Label>Filed under</Label>
                <TagList>
                  {TAGS.map((tag) => (
                    <Tag key={tag} id={tag}>
                      {tag}
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
            </div>

            <Separator className="my-8 max-w-2xl" />

            <div className="max-w-2xl">
              <Engagement
                liked={liked}
                onLikedChange={setLiked}
                saved={saved}
                onSavedChange={setSaved}
                copied={copied}
                onCopy={copyLink}
              />
            </div>

            <div className="mt-8 max-w-2xl">
              <AuthorCard
                following={following}
                onFollowingChange={setFollowing}
              />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-8">
              <TableOfContents active={active} />
              <Separator />
              <ShareRail copied={copied} onCopy={copyLink} />
              <NewsletterCard />
            </div>
          </aside>
        </div>

        <Separator className="my-12" />

        <ReadNext />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:px-6">
          <span>© 2026 Meridian Labs</span>
          <div className="flex flex-wrap gap-4 sm:ml-auto">
            <a href="#" className="hover:text-fg">
              Engineering
            </a>
            <a href="#" className="hover:text-fg">
              Changelog
            </a>
            <a href="#" className="hover:text-fg">
              Careers
            </a>
            <a href="#" className="hover:text-fg">
              RSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
