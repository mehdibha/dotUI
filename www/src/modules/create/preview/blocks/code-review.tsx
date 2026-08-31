"use client"

import { type ReactNode, useMemo, useState } from "react"

import {
  AlertCircleIcon,
  BellIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleDotIcon,
  CodeIcon,
  CopyIcon,
  EyeIcon,
  FileCodeIcon,
  FileTextIcon,
  GitBranchIcon,
  LinkIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SmileIcon,
  TerminalIcon,
  XCircleIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { FieldGroup, Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Loader } from "@/registry/ui/loader"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
} from "@/registry/ui/progress-bar"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const PR = {
  number: 4821,
  title: "Retry webhook deliveries with jittered exponential backoff",
  author: "Priya Raghavan",
  base: "main",
  head: "fix/webhook-retry-jitter",
  commits: 6,
  additions: 199,
  deletions: 16,
}

const LABELS = ["bug", "webhooks", "needs-changelog"]

const REVIEWERS = [
  { name: "Marco Feld", state: "approved" as const, when: "2 days ago" },
  {
    name: "Dana Whitfield",
    state: "changes" as const,
    when: "yesterday",
  },
  { name: "Tom Okafor", state: "pending" as const, when: "requested" },
]

const CHECKS = [
  { name: "build / compile", status: "success" as const, meta: "1m 12s" },
  { name: "lint / oxlint", status: "success" as const, meta: "18s" },
  {
    name: "test / unit (node 22)",
    status: "success" as const,
    meta: "2m 04s",
  },
  { name: "test / integration", status: "success" as const, meta: "4m 31s" },
  { name: "e2e / playwright", status: "failure" as const, meta: "6m 02s" },
  { name: "deploy / preview", status: "running" as const, meta: "68%" },
]

type DiffLineKind = "add" | "del" | "ctx" | "hunk"

interface DiffLine {
  kind: DiffLineKind
  old?: number
  new?: number
  text: string
  /** Id of the inline thread anchored to this line, if any. */
  thread?: string
}

interface ChangedFile {
  path: string
  kind: "modified" | "added"
  additions: number
  deletions: number
  comments: number
  lines: DiffLine[]
}

const FILES: ChangedFile[] = [
  {
    path: "src/webhooks/dispatcher.ts",
    kind: "modified",
    additions: 38,
    deletions: 12,
    comments: 2,
    lines: [
      { kind: "hunk", text: "@@ -1,7 +1,8 @@ webhook dispatcher" },
      {
        kind: "ctx",
        old: 1,
        new: 1,
        text: `import { RelayError } from "../errors"`,
      },
      {
        kind: "ctx",
        old: 2,
        new: 2,
        text: `import { createLogger } from "../logging"`,
      },
      { kind: "add", new: 3, text: `import { nextDelay } from "./backoff"` },
      { kind: "ctx", old: 3, new: 4, text: "" },
      { kind: "ctx", old: 4, new: 5, text: "const MAX_ATTEMPTS = 5" },
      { kind: "del", old: 5, text: "const RETRY_DELAY_MS = 2_000" },
      {
        kind: "add",
        new: 6,
        text: "const RETRYABLE = new Set([408, 429, 500, 502, 503, 504])",
      },
      {
        kind: "hunk",
        text: "@@ -42,15 +43,26 @@ export async function dispatch(event) {",
      },
      {
        kind: "ctx",
        old: 42,
        new: 43,
        text: "  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {",
      },
      {
        kind: "del",
        old: 43,
        text: "    const response = await deliver(event)",
      },
      { kind: "del", old: 44, text: "    if (response.ok) return response" },
      { kind: "del", old: 45, text: "" },
      {
        kind: "del",
        old: 46,
        text: `    log.warn("delivery failed, retrying", { attempt })`,
      },
      {
        kind: "del",
        old: 47,
        text: "    await sleep(RETRY_DELAY_MS * attempt)",
      },
      { kind: "add", new: 44, text: "    try {" },
      {
        kind: "add",
        new: 45,
        text: "      const response = await deliver(event, { timeout: 15_000 })",
      },
      { kind: "add", new: 46, text: "      if (response.ok) return response" },
      {
        kind: "add",
        new: 47,
        text: "      if (!RETRYABLE.has(response.status)) throw new RelayError(response)",
      },
      { kind: "add", new: 48, text: "    } catch (error) {" },
      {
        kind: "add",
        new: 49,
        text: "      if (attempt === MAX_ATTEMPTS) throw error",
        thread: "dispatcher-retry",
      },
      { kind: "add", new: 50, text: "    }" },
      { kind: "add", new: 51, text: "" },
      { kind: "add", new: 52, text: "    const delay = nextDelay(attempt)" },
      {
        kind: "add",
        new: 53,
        text: `    log.warn("delivery failed, retrying", { attempt, delay })`,
      },
      { kind: "add", new: 54, text: "    await sleep(delay)" },
      { kind: "ctx", old: 48, new: 55, text: "  }" },
      { kind: "ctx", old: 49, new: 56, text: "" },
      {
        kind: "ctx",
        old: 50,
        new: 57,
        text: "  throw new RelayError(`gave up after ${MAX_ATTEMPTS} attempts`)",
      },
    ],
  },
  {
    path: "src/webhooks/backoff.ts",
    kind: "added",
    additions: 64,
    deletions: 0,
    comments: 0,
    lines: [
      { kind: "hunk", text: "@@ -0,0 +1,12 @@" },
      { kind: "add", new: 1, text: "const BASE_DELAY_MS = 500" },
      { kind: "add", new: 2, text: "const MAX_DELAY_MS = 30_000" },
      { kind: "add", new: 3, text: "" },
      {
        kind: "add",
        new: 4,
        text: "/** Full-jitter exponential backoff: random point inside a growing window. */",
      },
      {
        kind: "add",
        new: 5,
        text: "export function nextDelay(attempt: number, random = Math.random) {",
      },
      {
        kind: "add",
        new: 6,
        text: "  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1))",
      },
      { kind: "add", new: 7, text: "  return Math.round(random() * ceiling)" },
      { kind: "add", new: 8, text: "}" },
    ],
  },
  {
    path: "src/webhooks/dispatcher.test.ts",
    kind: "modified",
    additions: 91,
    deletions: 4,
    comments: 1,
    lines: [
      { kind: "hunk", text: '@@ -18,6 +18,21 @@ describe("dispatch", () => {' },
      {
        kind: "ctx",
        old: 18,
        new: 18,
        text: "  const event = buildEvent({ endpoint: FLAPPING_URL })",
      },
      { kind: "ctx", old: 19, new: 19, text: "" },
      {
        kind: "add",
        new: 20,
        text: `  it("spreads retries with full jitter", async () => {`,
        thread: "test-ceiling",
      },
      {
        kind: "add",
        new: 21,
        text: "    const delays = collectDelays(() => dispatch(event), {",
      },
      { kind: "add", new: 22, text: "      random: () => 0.5," },
      { kind: "add", new: 23, text: "    })" },
      { kind: "add", new: 24, text: "" },
      {
        kind: "add",
        new: 25,
        text: "    expect(delays).toEqual([250, 500, 1_000, 2_000])",
      },
      { kind: "add", new: 26, text: "  })" },
      { kind: "add", new: 27, text: "" },
      {
        kind: "del",
        old: 20,
        text: `  it("retries five times", async () => {`,
      },
      {
        kind: "del",
        old: 21,
        text: "    expect(await attempts(event)).toBe(5)",
      },
      { kind: "del", old: 22, text: "  })" },
      { kind: "ctx", old: 23, new: 28, text: "})" },
    ],
  },
  {
    path: "docs/changelog.md",
    kind: "modified",
    additions: 6,
    deletions: 0,
    comments: 0,
    lines: [
      { kind: "hunk", text: "@@ -1,5 +1,11 @@" },
      { kind: "ctx", old: 1, new: 1, text: "# Changelog" },
      { kind: "ctx", old: 2, new: 2, text: "" },
      { kind: "add", new: 3, text: "## Unreleased" },
      { kind: "add", new: 4, text: "" },
      {
        kind: "add",
        new: 5,
        text: "- Webhook retries now use full-jitter exponential backoff, capped at 30s,",
      },
      {
        kind: "add",
        new: 6,
        text: "  so a recovering endpoint no longer takes the whole queue at once.",
      },
      { kind: "add", new: 7, text: "" },
      { kind: "ctx", old: 3, new: 8, text: "## 3.8.2" },
    ],
  },
]

interface ThreadReply {
  author: string
  when: string
  body: string
}

const THREADS: Record<
  string,
  { author: string; when: string; body: string; replies: ThreadReply[] }
> = {
  "dispatcher-retry": {
    author: "Dana Whitfield",
    when: "yesterday at 09:14",
    body: "Catching everything until the last attempt means a 401 still burns five deliveries — the `RelayError` we throw on line 47 lands right back in this block. Can we rethrow anything that isn't a transport error instead?",
    replies: [
      {
        author: "Priya Raghavan",
        when: "yesterday at 11:02",
        body: "Good catch. Pushed d41f8ac: the catch now rethrows unless the error is an `AbortError` or a socket failure, so non-retryable statuses fail on the first attempt.",
      },
    ],
  },
  "test-ceiling": {
    author: "Marco Feld",
    when: "2 days ago at 16:40",
    body: "Nice — the injectable RNG makes this readable. Could you pin the 30s ceiling too, so bumping `MAX_ATTEMPTS` later can't quietly push the last delay past the cap?",
    replies: [],
  },
}

type TimelineItem =
  | { type: "body"; author: string; when: string }
  | {
      type: "review"
      author: string
      when: string
      state: "approved" | "changes" | "commented"
      body: string
    }
  | { type: "commits"; author: string; when: string; shas: string[] }
  | { type: "check"; when: string }
  | { type: "comment"; author: string; when: string; body: string }

const TIMELINE: TimelineItem[] = [
  { type: "body", author: PR.author, when: "3 days ago" },
  {
    type: "review",
    author: "Marco Feld",
    when: "2 days ago",
    state: "approved",
    body: "Backoff math checks out and the injectable RNG keeps the tests honest. One optional nit on the ceiling test, otherwise this is good to go.",
  },
  {
    type: "review",
    author: "Dana Whitfield",
    when: "yesterday",
    state: "changes",
    body: "One blocking issue on the catch block in `dispatcher.ts` — see the inline thread. Everything else reads well.",
  },
  {
    type: "commits",
    author: PR.author,
    when: "16 hours ago",
    shas: [
      "d41f8ac rethrow non-transport errors before retrying",
      "a97c30b pin the 30s ceiling in the jitter test",
    ],
  },
  { type: "check", when: "12 minutes ago" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

/** Turns the `backtick` spans review comments are written with into code. */
function inlineCode(text: string) {
  return text.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
      >
        {part}
      </code>
    ) : (
      part
    ),
  )
}

function BranchBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-fg-muted">
      <GitBranchIcon className="size-3 shrink-0" />
      <span className="truncate">{name}</span>
    </span>
  )
}

function CheckIndicator({
  status,
}: {
  status: (typeof CHECKS)[number]["status"]
}) {
  if (status === "success")
    return <CheckCircle2Icon className="size-4 shrink-0 text-fg-success" />
  if (status === "failure")
    return <XCircleIcon className="size-4 shrink-0 text-fg-danger" />
  return <Loader className="size-4 shrink-0 text-fg-warning" />
}

/* --------------------------------- Header --------------------------------- */

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <CodeIcon className="size-5 shrink-0" />
        <nav className="flex min-w-0 items-center gap-1 text-sm">
          <span className="hidden text-fg-muted sm:inline">northwind</span>
          <span className="hidden text-fg-muted sm:inline">/</span>
          <span className="truncate font-medium">relay-api</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchField
            aria-label="Search this repository"
            className="hidden w-56 md:block"
          >
            <Input placeholder="Search pull requests" />
          </SearchField>
          <Tooltip>
            <Button variant="quiet" isIconOnly aria-label="Notifications">
              <BellIcon />
            </Button>
            <TooltipContent>3 unread notifications</TooltipContent>
          </Tooltip>
          <Avatar size="sm">
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

function PullRequestHeader({
  merged,
  onMerge,
}: {
  merged: boolean
  onMerge: () => void
}) {
  const [mergeOpen, setMergeOpen] = useState(false)
  const [method, setMethod] = useState("squash")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {PR.title}{" "}
            <span className="font-normal text-fg-muted">#{PR.number}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-fg-muted">
            <Badge variant={merged ? "accent" : "success"} size="lg">
              {merged ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <CircleDotIcon className="size-3.5" />
              )}
              {merged ? "Merged" : "Open"}
            </Badge>
            <Avatar size="sm">
              <AvatarFallback>{initials(PR.author)}</AvatarFallback>
            </Avatar>
            <span>
              <span className="font-medium text-fg">{PR.author}</span> wants to
              merge {PR.commits} commits into
            </span>
            <BranchBadge name={PR.base} />
            <span>from</span>
            <BranchBadge name={PR.head} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Tooltip>
            <Button
              variant="secondary"
              isIconOnly
              aria-label="Copy branch name"
            >
              <CopyIcon />
            </Button>
            <TooltipContent>Copy {PR.head}</TooltipContent>
          </Tooltip>
          <Button
            variant="primary"
            isDisabled={merged}
            onPress={() => setMergeOpen(true)}
          >
            {merged ? "Merged" : "Merge pull request"}
          </Button>
          <Menu>
            <Button variant="secondary" isIconOnly aria-label="More actions">
              <MoreHorizontalIcon />
            </Button>
            <Popover placement="bottom end">
              <MenuContent>
                <MenuItem>
                  <LinkIcon />
                  Copy link
                </MenuItem>
                <MenuItem>
                  <TerminalIcon />
                  Check out locally
                </MenuItem>
                <MenuItem>
                  <FileTextIcon />
                  Open in editor
                </MenuItem>
                <Separator />
                <MenuItem variant="danger">Close pull request</MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </div>

      <Dialog isOpen={mergeOpen} onOpenChange={setMergeOpen}>
        <Modal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Merge pull request #{PR.number}</DialogTitle>
              <DialogDescription>
                {PR.commits} commits from {PR.head} will land on {PR.base}.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="gap-4">
              <RadioGroup value={method} onChange={setMethod}>
                <Label>Merge method</Label>
                <FieldGroup>
                  <Radio value="merge">
                    <RadioControl />
                    <Label>Create a merge commit</Label>
                  </Radio>
                  <Radio value="squash">
                    <RadioControl />
                    <Label>Squash and merge</Label>
                  </Radio>
                  <Radio value="rebase">
                    <RadioControl />
                    <Label>Rebase and merge</Label>
                  </Radio>
                </FieldGroup>
              </RadioGroup>
              <TextField defaultValue={`${PR.title} (#${PR.number})`}>
                <Label>Commit message</Label>
                <Input />
              </TextField>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button
                variant="primary"
                onPress={() => {
                  onMerge()
                  setMergeOpen(false)
                }}
              >
                Confirm merge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Modal>
      </Dialog>
    </div>
  )
}

function ChecksSummary() {
  const passed = CHECKS.filter((c) => c.status === "success").length
  const failed = CHECKS.filter((c) => c.status === "failure").length
  const running = CHECKS.length - passed - failed

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AlertCircleIcon className="size-5 shrink-0 text-fg-danger" />
          <div className="min-w-0">
            <p className="text-sm font-medium">
              Some checks were not successful
            </p>
            <p className="truncate text-xs text-fg-muted">
              {passed} successful, {failed} failing, {running} in progress —{" "}
              {CHECKS.length} total
            </p>
          </div>
        </div>
        <ProgressBar
          value={passed}
          maxValue={CHECKS.length}
          aria-label="Checks passed"
          className="sm:ml-auto sm:w-48"
        >
          <ProgressBarControl>
            <ProgressBarFill className="bg-success" />
          </ProgressBarControl>
        </ProgressBar>
      </div>
      <Separator />
      <Disclosure className="px-4">
        <DisclosureTrigger className="text-sm">
          Show all checks
        </DisclosureTrigger>
        <DisclosurePanel>
          <ul className="flex flex-col">
            {CHECKS.map((check) => (
              <li
                key={check.name}
                className="flex items-center gap-3 border-t py-2 first:border-t-0"
              >
                <CheckIndicator status={check.status} />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">
                  {check.name}
                </span>
                <span className="shrink-0 text-xs text-fg-muted tabular-nums">
                  {check.meta}
                </span>
                <Button variant="link" size="sm">
                  Details
                </Button>
              </li>
            ))}
          </ul>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}

/* ------------------------------ Review action ----------------------------- */

function ReviewAction({
  decision,
  onSubmit,
}: {
  decision: string | null
  onSubmit: (decision: string, body: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState("approve")
  const [body, setBody] = useState("")

  return (
    <Dialog isOpen={open} onOpenChange={setOpen}>
      <Button variant="secondary">
        <MessageSquareIcon />
        {decision ? "Update review" : "Review changes"}
        <ChevronDownIcon className="size-3.5" />
      </Button>
      <Popover
        placement="bottom end"
        className="w-[min(22rem,calc(100vw-2rem))]"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish your review</DialogTitle>
          </DialogHeader>
          <DialogBody className="gap-4">
            <TextField
              value={body}
              onChange={setBody}
              aria-label="Review summary"
            >
              {/* The auto-grow TextArea measures against the popover's
                  unpositioned height, so cap it. */}
              <TextArea
                rows={4}
                className="max-h-28"
                placeholder="Leave a summary for the author…"
              />
            </TextField>
            <RadioGroup value={choice} onChange={setChoice}>
              <Label>Decision</Label>
              <FieldGroup>
                <Radio value="comment">
                  <RadioControl />
                  <Label>Comment</Label>
                </Radio>
                <Radio value="approve">
                  <RadioControl />
                  <Label>Approve</Label>
                </Radio>
                <Radio value="changes">
                  <RadioControl />
                  <Label>Request changes</Label>
                </Radio>
              </FieldGroup>
            </RadioGroup>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button
              variant="primary"
              onPress={() => {
                onSubmit(choice, body)
                setBody("")
                setOpen(false)
              }}
            >
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}

/* ---------------------------------- Diff ---------------------------------- */

const LINE_TINT: Record<DiffLineKind, string> = {
  add: "bg-success-muted/70",
  del: "bg-danger-muted/70",
  ctx: "",
  hunk: "bg-muted text-fg-muted",
}

const SIGN_TINT: Record<DiffLineKind, string> = {
  add: "text-fg-success",
  del: "text-fg-danger",
  ctx: "text-fg-muted",
  hunk: "text-fg-muted",
}

function DiffRow({ line }: { line: DiffLine }) {
  const sign = line.kind === "add" ? "+" : line.kind === "del" ? "-" : " "

  return (
    <div
      className={cn(
        "grid grid-cols-[2.5rem_1.25rem_1fr] sm:grid-cols-[3rem_3rem_1.25rem_1fr]",
        LINE_TINT[line.kind],
      )}
    >
      {line.kind === "hunk" ? (
        <span className="col-span-full px-3 py-1 whitespace-pre">
          {line.text}
        </span>
      ) : (
        <>
          <span className="hidden px-2 py-0.5 text-right text-fg-muted tabular-nums select-none sm:block">
            {line.old ?? ""}
          </span>
          <span className="px-2 py-0.5 text-right text-fg-muted tabular-nums select-none">
            {line.new ?? ""}
          </span>
          <span
            className={cn(
              "py-0.5 text-center select-none",
              SIGN_TINT[line.kind],
            )}
          >
            {sign}
          </span>
          <span className="py-0.5 pr-4 whitespace-pre">{line.text}</span>
        </>
      )}
    </div>
  )
}

function InlineThread({ id }: { id: string }) {
  const thread = THREADS[id]
  const [replies, setReplies] = useState<ThreadReply[]>(thread?.replies ?? [])
  const [draft, setDraft] = useState("")
  const [resolved, setResolved] = useState(false)

  if (!thread) return null

  return (
    <div className="border-y bg-bg">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Avatar size="sm" className="shrink-0">
              <AvatarFallback>{initials(thread.author)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm">
                <span className="font-medium">{thread.author}</span>{" "}
                <span className="text-fg-muted">{thread.when}</span>
              </p>
              <p className="mt-1 text-sm text-pretty text-fg-muted">
                {inlineCode(thread.body)}
              </p>
            </div>
          </div>
          {resolved && (
            <Badge variant="success" appearance="subtle">
              Resolved
            </Badge>
          )}
        </div>

        {replies.map((reply) => (
          <div
            key={`${reply.author}-${reply.when}`}
            className="flex items-start gap-3 border-l-2 pl-4"
          >
            <Avatar size="sm" className="shrink-0">
              <AvatarFallback>{initials(reply.author)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm">
                <span className="font-medium">{reply.author}</span>{" "}
                <span className="text-fg-muted">{reply.when}</span>
              </p>
              <p className="mt-1 text-sm text-pretty text-fg-muted">
                {inlineCode(reply.body)}
              </p>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <TextField value={draft} onChange={setDraft} aria-label="Reply">
            <TextArea rows={2} placeholder="Reply…" />
          </TextField>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-fg-muted sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
              to reply
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" onPress={() => setResolved((value) => !value)}>
                {resolved ? "Unresolve" : "Resolve conversation"}
              </Button>
              <Button
                size="sm"
                variant="primary"
                isDisabled={draft.trim().length === 0}
                onPress={() => {
                  setReplies((current) => [
                    ...current,
                    { author: "Sam Lindqvist", when: "just now", body: draft },
                  ])
                  setDraft("")
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function splitOnThreads(lines: DiffLine[]) {
  const chunks: { lines: DiffLine[]; thread?: string }[] = []
  let current: DiffLine[] = []
  for (const line of lines) {
    current.push(line)
    if (line.thread) {
      chunks.push({ lines: current, thread: line.thread })
      current = []
    }
  }
  if (current.length > 0) chunks.push({ lines: current })
  return chunks
}

function FileDiff({
  file,
  isViewed,
  onViewedChange,
}: {
  file: ChangedFile
  isViewed: boolean
  onViewedChange: (viewed: boolean) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b bg-bg px-4 py-3">
        <FileCodeIcon className="size-4 shrink-0 text-fg-muted" />
        <span className="min-w-0 flex-1 truncate font-mono text-sm">
          {file.path}
        </span>
        {file.kind === "added" && (
          <Badge variant="success" appearance="subtle" size="sm">
            New file
          </Badge>
        )}
        <span className="font-mono text-xs tabular-nums">
          <span className="text-fg-success">+{file.additions}</span>{" "}
          <span className="text-fg-danger">−{file.deletions}</span>
        </span>
        <Checkbox isSelected={isViewed} onChange={onViewedChange}>
          <CheckboxControl />
          <Label className="text-xs">Viewed</Label>
        </Checkbox>
      </div>

      {/* Threads sit between scrollers, never inside one, so a comment never
          needs horizontal scrolling to read. */}
      {splitOnThreads(file.lines).map((chunk, index) => (
        <div key={`${file.path}-chunk-${index}`}>
          <div className="overflow-x-auto font-mono text-xs leading-relaxed">
            <div className="w-max min-w-full">
              {chunk.lines.map((line, lineIndex) => (
                <DiffRow
                  key={`${file.path}-${index}-${lineIndex}`}
                  line={line}
                />
              ))}
            </div>
          </div>
          {chunk.thread && <InlineThread id={chunk.thread} />}
        </div>
      ))}
    </div>
  )
}

function FilesChanged() {
  const [selected, setSelected] = useState(FILES[0]?.path ?? "")
  const [viewed, setViewed] = useState<string[]>([])
  const [filter, setFilter] = useState("all")

  const visible = useMemo(
    () =>
      FILES.filter((file) => {
        if (filter === "unviewed") return !viewed.includes(file.path)
        if (filter === "commented") return file.comments > 0
        return true
      }),
    [filter, viewed],
  )

  // Filtering the selected file out moves the diff to the next visible one,
  // so the list and the diff pane never disagree.
  const active = visible.find((file) => file.path === selected) ?? visible[0]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-3 lg:sticky lg:top-20">
        <SegmentedControl
          selectedKeys={[filter]}
          onSelectionChange={(keys) =>
            setFilter([...keys][0]?.toString() ?? "all")
          }
          aria-label="Filter files"
        >
          <SegmentedControlItem id="all">All</SegmentedControlItem>
          <SegmentedControlItem id="unviewed">Unviewed</SegmentedControlItem>
          <SegmentedControlItem id="commented">Commented</SegmentedControlItem>
        </SegmentedControl>

        {visible.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckCircle2Icon />
              </EmptyMedia>
              <EmptyTitle>Every file reviewed</EmptyTitle>
              <EmptyDescription>
                Nothing left in this filter — switch back to All to re-read the
                diff.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ListBox
            aria-label="Changed files"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={active ? [active.path] : []}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next) setSelected(next.toString())
            }}
            className="w-full"
          >
            {visible.map((file) => {
              const name = file.path.split("/").pop() ?? file.path
              const dir = file.path.slice(0, file.path.length - name.length)
              return (
                <ListBoxItem
                  key={file.path}
                  id={file.path}
                  textValue={file.path}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <FileCodeIcon className="size-4 shrink-0 text-fg-muted" />
                    {/* The directory truncates, never the file name. */}
                    <span className="flex min-w-0 flex-1 text-sm">
                      <span className="truncate text-fg-muted">{dir}</span>
                      <span className="shrink-0">{name}</span>
                    </span>
                    {file.comments > 0 && (
                      <Badge appearance="subtle" size="sm">
                        <MessageSquareIcon className="size-3" />
                        {file.comments}
                      </Badge>
                    )}
                    {viewed.includes(file.path) && (
                      <EyeIcon className="size-3.5 shrink-0 text-fg-success" />
                    )}
                  </div>
                </ListBoxItem>
              )
            })}
          </ListBox>
        )}

        <p className="px-1 text-xs text-fg-muted">
          {FILES.length} files changed ·{" "}
          <span className="text-fg-success">+{PR.additions}</span>{" "}
          <span className="text-fg-danger">−{PR.deletions}</span>
        </p>
      </div>

      {active && (
        <FileDiff
          file={active}
          isViewed={viewed.includes(active.path)}
          onViewedChange={(next) =>
            setViewed((current) =>
              next
                ? [...current, active.path]
                : current.filter((path) => path !== active.path),
            )
          }
        />
      )}
    </div>
  )
}

/* ------------------------------ Conversation ------------------------------ */

function TimelineCard({
  author,
  when,
  header,
  children,
}: {
  author: string
  when: string
  header?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex gap-3">
      <Avatar size="md" className="mt-1 shrink-0">
        <AvatarFallback>{initials(author)}</AvatarFallback>
      </Avatar>
      <Card className="min-w-0 flex-1">
        <CardHeader className="flex flex-wrap items-center gap-2 border-b">
          <CardTitle className="text-sm">{author}</CardTitle>
          <span className="text-xs text-fg-muted">{when}</span>
          {header}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

function EventRow({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof CheckCircle2Icon
  tone: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 pl-1">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted",
          tone,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 pt-1.5 text-sm text-fg-muted">
        {children}
      </div>
    </div>
  )
}

function PullRequestBody() {
  const [liked, setLiked] = useState(false)

  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="text-pretty text-fg-muted">
        Deliveries to a flapping endpoint retry on a fixed 2s ladder today, so
        every queued event for that endpoint wakes up at the same instant and
        hammers it again. Thursday&apos;s incident (INC-2291) was 40k
        simultaneous retries against one customer.
      </p>
      <p className="text-pretty text-fg-muted">
        This moves retries onto full-jitter exponential backoff — 500ms base,
        doubling per attempt, capped at 30s, multiplied by a uniform random
        factor.
      </p>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-fg-muted marker:text-fg-muted">
        <li>Retryable statuses (408, 429, 5xx) keep their attempt budget.</li>
        <li>Everything else fails fast instead of burning five deliveries.</li>
        <li>
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            nextDelay
          </code>{" "}
          takes an injectable RNG, so the tests stay deterministic.
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <ToggleButton
          size="sm"
          isSelected={liked}
          onChange={setLiked}
          aria-label="Add a reaction"
        >
          <SmileIcon />
          {liked ? 4 : 3}
        </ToggleButton>
        <Button size="sm" variant="quiet">
          Quote reply
        </Button>
      </div>
    </div>
  )
}

function Conversation({
  extra,
  decision,
  onReview,
  merged,
}: {
  extra: TimelineItem[]
  decision: string | null
  onReview: (decision: string, body: string) => void
  merged: boolean
}) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<TimelineItem[]>([])

  const items = [...TIMELINE, ...extra, ...comments]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="flex min-w-0 flex-col gap-4">
        {merged && (
          <Alert variant="success">
            <CheckCircle2Icon />
            <AlertTitle>Pull request merged</AlertTitle>
            <AlertDescription>
              {PR.head} was squashed into {PR.base}. The branch can be safely
              deleted.
            </AlertDescription>
          </Alert>
        )}

        {items.map((item, index) => {
          if (item.type === "body")
            return (
              <TimelineCard
                key="body"
                author={item.author}
                when={item.when}
                header={
                  <Badge appearance="subtle" size="sm">
                    Author
                  </Badge>
                }
              >
                <PullRequestBody />
              </TimelineCard>
            )

          if (item.type === "review")
            return (
              <TimelineCard
                key={`review-${index}`}
                author={item.author}
                when={item.when}
                header={
                  <Badge
                    variant={
                      item.state === "approved"
                        ? "success"
                        : item.state === "changes"
                          ? "danger"
                          : "neutral"
                    }
                    appearance="subtle"
                    size="sm"
                  >
                    {item.state === "approved"
                      ? "Approved"
                      : item.state === "changes"
                        ? "Requested changes"
                        : "Commented"}
                  </Badge>
                }
              >
                <p className="text-sm text-pretty text-fg-muted">
                  {inlineCode(item.body)}
                </p>
              </TimelineCard>
            )

          if (item.type === "comment")
            return (
              <TimelineCard
                key={`comment-${index}`}
                author={item.author}
                when={item.when}
              >
                <p className="text-sm text-pretty text-fg-muted">
                  {inlineCode(item.body)}
                </p>
              </TimelineCard>
            )

          if (item.type === "commits")
            return (
              <EventRow
                key={`commits-${index}`}
                icon={CodeIcon}
                tone="text-fg-muted"
              >
                <span className="font-medium text-fg">{item.author}</span>{" "}
                pushed {item.shas.length} commits {item.when}
                <ul className="mt-2 flex flex-col gap-1">
                  {item.shas.map((sha) => (
                    <li key={sha} className="font-mono text-xs">
                      <span className="text-fg">{sha.slice(0, 7)}</span>
                      {sha.slice(7)}
                    </li>
                  ))}
                </ul>
              </EventRow>
            )

          return (
            <EventRow
              key={`check-${index}`}
              icon={XCircleIcon}
              tone="text-fg-danger"
            >
              <span className="font-mono text-fg">e2e / playwright</span> failed{" "}
              {item.when} — 2 specs timed out waiting on the preview deployment.
            </EventRow>
          )
        })}

        <Separator />

        <div className="flex gap-3">
          <Avatar size="md" className="mt-1 hidden shrink-0 sm:inline-flex">
            <AvatarFallback>SL</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <TextField
              value={comment}
              onChange={setComment}
              aria-label="Add a comment"
            >
              <TextArea rows={4} placeholder="Leave a comment…" />
            </TextField>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ReviewAction decision={decision} onSubmit={onReview} />
              <Button
                variant="primary"
                isDisabled={comment.trim().length === 0}
                onPress={() => {
                  setComments((current) => [
                    ...current,
                    {
                      type: "comment",
                      author: "Sam Lindqvist",
                      when: "just now",
                      body: comment,
                    },
                  ])
                  setComment("")
                }}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-6 rounded-xl border bg-card p-4 text-sm lg:sticky lg:top-20">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Reviewers</h3>
          {REVIEWERS.map((reviewer) => (
            <div key={reviewer.name} className="flex items-center gap-2">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback>{initials(reviewer.name)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate">
                {reviewer.name}
                <span className="block text-xs text-fg-muted">
                  {reviewer.when}
                </span>
              </span>
              {reviewer.state === "approved" && (
                <CheckCircle2Icon className="size-4 shrink-0 text-fg-success" />
              )}
              {reviewer.state === "changes" && (
                <AlertCircleIcon className="size-4 shrink-0 text-fg-danger" />
              )}
              {reviewer.state === "pending" && (
                <CircleDotIcon className="size-4 shrink-0 text-fg-muted" />
              )}
            </div>
          ))}
        </div>

        <Separator />

        <TagGroup size="sm" aria-label="Labels">
          <h3 className="text-sm font-medium">Labels</h3>
          <TagList>
            {LABELS.map((label) => (
              <Tag key={label} id={label}>
                {label}
              </Tag>
            ))}
          </TagList>
        </TagGroup>

        <Separator />

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Participants</h3>
          <AvatarGroup size="sm">
            <Avatar>
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MF</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </div>

        <Separator />

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium">Milestone</h3>
          <span className="text-fg-muted">Relay 3.9 — 62% complete</span>
          <ProgressBar
            value={62}
            aria-label="Milestone progress"
            className="mt-1"
          >
            <ProgressBarControl />
          </ProgressBar>
        </div>
      </aside>
    </div>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function CodeReviewBlock() {
  const [tab, setTab] = useState("conversation")
  const [merged, setMerged] = useState(false)
  const [decision, setDecision] = useState<string | null>(null)
  const [reviews, setReviews] = useState<TimelineItem[]>([])

  const submitReview = (choice: string, body: string) => {
    setDecision(choice)
    setReviews((current) => [
      ...current,
      {
        type: "review",
        author: "Sam Lindqvist",
        when: "just now",
        state:
          choice === "approve"
            ? "approved"
            : choice === "changes"
              ? "changes"
              : "commented",
        body: body.trim() || "Reviewed the diff — no further comments.",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <TopBar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <PullRequestHeader merged={merged} onMerge={() => setMerged(true)} />
        <ChecksSummary />

        <Tabs
          selectedKey={tab}
          onSelectionChange={(key) => setTab(String(key))}
        >
          {/* The line indicator hangs below the list, so the scroller needs
              bottom room or it gets clipped. */}
          <div className="-mb-1.5 overflow-x-auto pb-1.5">
            <TabList variant="line">
              <Tab id="conversation">
                <MessageSquareIcon className="size-4" />
                Conversation
                <Badge appearance="subtle" size="sm">
                  8
                </Badge>
              </Tab>
              <Tab id="files">
                <FileCodeIcon className="size-4" />
                Files changed
                <Badge appearance="subtle" size="sm">
                  {FILES.length}
                </Badge>
              </Tab>
            </TabList>
          </div>
          <TabPanel id="conversation" className="pt-6">
            <Conversation
              extra={reviews}
              decision={decision}
              onReview={submitReview}
              merged={merged}
            />
          </TabPanel>
          <TabPanel id="files" className="pt-6">
            <FilesChanged />
          </TabPanel>
        </Tabs>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-fg-muted">
          <span className="flex items-center gap-2">
            <SearchIcon className="size-3.5" />
            Press <Kbd>/</Kbd> to search this diff
          </span>
          <span className="font-mono">
            northwind/relay-api · #{PR.number} · {PR.head}
          </span>
        </footer>
      </main>
    </div>
  )
}
