import { useState } from "react"
import type { ReactNode } from "react"

import {
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CopyIcon,
  FileCodeIcon,
  GitBranchIcon,
  LayersIcon,
  LoaderCircleIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SparklesIcon,
  XCircleIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/field"
import { TextArea } from "@/registry/ui/input"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { initials } from "./shared"

// A Graphite-style pull request: the stack it belongs to on the left, the
// diff file by file with inline threads and a review bot, and a sidebar
// that says what still blocks the merge. Reviewing and merging both work.

type StackStatus = "merged" | "approved" | "current" | "draft"

const STACK: { id: number; title: string; status: StackStatus }[] = [
  {
    id: 483,
    title: "Show gift card balance in the order summary",
    status: "draft",
  },
  { id: 482, title: "Apply gift cards to checkout totals", status: "current" },
  {
    id: 481,
    title: "Add GiftCard model and balance lookup",
    status: "approved",
  },
  {
    id: 480,
    title: "Extract cart totals into a pure function",
    status: "merged",
  },
]

type LineType = "context" | "add" | "del" | "hunk"

interface DiffLine {
  type: LineType
  old?: number
  new?: number
  text: string
}

interface DiffFile {
  path: string
  status: "modified" | "added"
  lines: DiffLine[]
}

// Old and new line numbers are derived, so the hunks stay easy to edit.
function hunk(
  header: string,
  oldStart: number,
  newStart: number,
  body: string,
) {
  let o = oldStart
  let n = newStart
  const lines: DiffLine[] = [{ type: "hunk", text: header }]
  for (const raw of body.split("\n")) {
    const sign = raw[0]
    const text = raw.slice(1)
    if (sign === "+") lines.push({ type: "add", new: n++, text })
    else if (sign === "-") lines.push({ type: "del", old: o++, text })
    else lines.push({ type: "context", old: o++, new: n++, text })
  }
  return lines
}

const FILES: DiffFile[] = [
  {
    path: "src/checkout/totals.ts",
    status: "modified",
    lines: hunk(
      "@@ -12,14 +12,22 @@ export function totals(cart: Cart)",
      12,
      12,
      ` export function totals(cart: Cart, giftCard?: GiftCard): Totals {
   const subtotal = sum(cart.items.map((item) => item.price * item.qty))
   const discount = cart.promo ? subtotal * cart.promo.rate : 0
-  const taxable = subtotal - discount
-  const tax = round(taxable * cart.region.taxRate)
-  return { subtotal, discount, tax, total: taxable + tax }
+  const giftCardApplied = giftCard
+    ? Math.min(giftCard.balance, subtotal - discount)
+    : 0
+  const taxable = subtotal - discount - giftCardApplied
+  const tax = round(taxable * cart.region.taxRate)
+  return {
+    subtotal,
+    discount,
+    giftCardApplied,
+    tax,
+    total: taxable + tax,
+  }
 }`,
    ),
  },
  {
    path: "src/checkout/gift-card.ts",
    status: "added",
    lines: hunk(
      "@@ -0,0 +1,11 @@",
      0,
      1,
      `+import { db } from "../db"
+
+export interface GiftCard {
+  code: string
+  balance: number
+}
+
+export async function lookupGiftCard(code: string) {
+  const card = await db.giftCards.find({ code: code.trim().toUpperCase() })
+  return card && card.balance > 0 ? card : null
+}`,
    ),
  },
  {
    path: "src/checkout/totals.test.ts",
    status: "modified",
    lines: hunk(
      '@@ -40,6 +40,16 @@ describe("totals", () => {',
      40,
      40,
      `   expect(result.total).toBe(108)
 })

+it("caps the gift card at the amount due", () => {
+  const result = totals(cart(120), { code: "GIFT50", balance: 500 })
+  expect(result.giftCardApplied).toBe(120)
+  expect(result.total).toBe(0)
+})
+
+it("ignores an empty gift card", () => {
+  expect(totals(cart(120), { code: "ZERO", balance: 0 }).giftCardApplied).toBe(0)
+})
 })`,
    ),
  },
]

interface Comment {
  author: string
  bot?: boolean
  time: string
  body: string
  suggestion?: string
}

// Threads are keyed by "<path>:<line index>".
const INITIAL_THREADS: Record<string, Comment[]> = {
  "src/checkout/totals.ts:10": [
    {
      author: "Review bot",
      bot: true,
      time: "2h",
      body: "The gift card is subtracted before tax. In most US states a gift card is a form of payment, not a discount, so tax should be computed on `subtotal - discount` and the card applied to the total afterwards.",
      suggestion:
        "const taxable = subtotal - discount\nconst tax = round(taxable * cart.region.taxRate)\nconst total = Math.max(0, taxable + tax - giftCardApplied)",
    },
    {
      author: "Priya Raman",
      time: "1h",
      body: "Good catch. Finance confirmed it: gift cards are tender. I'll move it after tax.",
    },
  ],
  "src/checkout/gift-card.ts:9": [
    {
      author: "Marcus Lee",
      time: "45m",
      body: "Should a lookup miss be rate limited? Codes are guessable if someone scripts this endpoint.",
    },
  ],
}

const CHECKS = [
  { name: "build", status: "passed", time: "1m 12s" },
  { name: "typecheck", status: "passed", time: "48s" },
  { name: "unit tests", status: "passed", time: "2m 03s" },
  { name: "e2e / checkout", status: "running", time: "3m" },
  { name: "lint", status: "passed", time: "21s" },
] as const

function StackIcon({ status }: { status: StackStatus }) {
  if (status === "merged")
    return <CircleCheckIcon className="size-4 text-fg-accent" />
  if (status === "approved")
    return <CircleCheckIcon className="size-4 text-fg-success" />
  if (status === "current") return <CircleDotIcon className="size-4 text-fg" />
  return <CircleDashedIcon className="size-4 text-fg-muted" />
}

function StackPanel() {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center gap-2 px-2 pb-2 text-xs font-medium text-fg-muted">
        <LayersIcon className="size-3.5" />
        Stack
      </div>
      <ol className="relative">
        <span
          aria-hidden
          className="absolute top-4 bottom-4 left-[15.5px] w-px bg-border"
        />
        {STACK.map((pr) => (
          <li key={pr.id}>
            <button
              type="button"
              aria-current={pr.status === "current" ? "page" : undefined}
              className={cn(
                "relative flex w-full cursor-interactive items-start gap-2.5 rounded-(--studio-radius-item) px-2 py-2 text-left text-sm compact:text-xs",
                pr.status === "current" ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                  pr.status === "current" ? "bg-muted" : "bg-bg",
                )}
              >
                <StackIcon status={pr.status} />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "line-clamp-2",
                    pr.status === "current" && "font-medium",
                  )}
                >
                  {pr.title}
                </span>
                <span className="text-xs text-fg-muted">
                  #{pr.id} · {pr.status === "current" ? "this PR" : pr.status}
                </span>
              </span>
            </button>
          </li>
        ))}
        <li className="relative flex items-center gap-2.5 px-2 py-2 text-sm text-fg-muted compact:text-xs">
          <span className="flex size-4 shrink-0 items-center justify-center bg-bg">
            <GitBranchIcon className="size-4" />
          </span>
          main
        </li>
      </ol>
    </div>
  )
}

function FileTree({
  viewed,
  onJump,
}: {
  viewed: Set<string>
  onJump: (path: string) => void
}) {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between px-2 pb-2 text-xs font-medium text-fg-muted">
        <span>Files</span>
        <span className="tabular-nums">
          {viewed.size} of {FILES.length} viewed
        </span>
      </div>
      <ul>
        {FILES.map((file) => {
          const adds = file.lines.filter((l) => l.type === "add").length
          const dels = file.lines.filter((l) => l.type === "del").length
          return (
            <li key={file.path}>
              <button
                type="button"
                onClick={() => onJump(file.path)}
                className="flex w-full cursor-interactive items-center gap-2 rounded-(--studio-radius-item) px-2 py-1.5 text-left text-sm hover:bg-muted compact:text-xs"
              >
                {viewed.has(file.path) ? (
                  <CheckIcon className="size-3.5 shrink-0 text-fg-success" />
                ) : (
                  <FileCodeIcon className="size-3.5 shrink-0 text-fg-muted" />
                )}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-mono text-xs",
                    viewed.has(file.path) && "text-fg-muted",
                  )}
                >
                  {file.path.split("/").pop()}
                </span>
                <span className="font-mono text-xs text-fg-success">
                  +{adds}
                </span>
                {dels > 0 && (
                  <span className="font-mono text-xs text-fg-danger">
                    −{dels}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CommentView({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar size="sm">
        <AvatarFallback>
          {comment.bot ? (
            <BotIcon className="size-3.5" />
          ) : (
            initials(comment.author)
          )}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm compact:text-xs">
          <span className="font-medium">{comment.author}</span>
          {comment.bot && (
            <Badge size="sm" variant="neutral">
              <SparklesIcon />
              AI
            </Badge>
          )}
          <span className="text-xs text-fg-muted">{comment.time}</span>
        </div>
        <p className="mt-1 font-sans text-sm text-pretty whitespace-normal compact:text-xs">
          {comment.body}
        </p>
        {comment.suggestion && (
          <div className="mt-2 overflow-hidden rounded-(--studio-radius-item) border">
            <div className="flex items-center justify-between border-b bg-muted px-3 py-1.5 font-sans text-xs text-fg-muted">
              Suggested change
              <Button variant="secondary" size="xs">
                Commit suggestion
              </Button>
            </div>
            <pre className="overflow-x-auto bg-success-muted/50 px-3 py-2 font-mono text-xs">
              {comment.suggestion}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function Thread({
  comments,
  onReply,
  onCancel,
  resolved = false,
  onResolve,
}: {
  comments: Comment[]
  onReply: (body: string) => void
  onCancel?: () => void
  resolved?: boolean
  onResolve?: (resolved: boolean) => void
}) {
  const [draft, setDraft] = useState("")

  if (resolved) {
    return (
      <button
        type="button"
        onClick={() => onResolve?.(false)}
        className="flex w-full cursor-interactive items-center gap-2 border-y bg-muted/50 px-4 py-2 font-sans text-xs text-fg-muted hover:text-fg"
      >
        <CheckIcon className="size-3.5" />
        Resolved thread · {comments.length}{" "}
        {comments.length === 1 ? "comment" : "comments"}
      </button>
    )
  }

  return (
    <div className="border-y bg-bg px-4 py-3 font-sans">
      <div className="flex max-w-3xl flex-col gap-4 rounded-(--studio-radius-card) border p-4">
        {comments.map((comment, index) => (
          <CommentView key={index} comment={comment} />
        ))}
        <TextField
          aria-label="Reply"
          value={draft}
          onChange={setDraft}
          autoFocus={comments.length === 0}
        >
          <TextArea
            placeholder={comments.length ? "Reply…" : "Leave a comment…"}
            className="min-h-16"
          />
        </TextField>
        <div className="flex items-center gap-2">
          {onResolve && (
            <Button variant="quiet" size="sm" onPress={() => onResolve(true)}>
              <CheckIcon />
              Resolve
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            {onCancel && (
              <Button variant="quiet" size="sm" onPress={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              isDisabled={!draft.trim()}
              onPress={() => {
                onReply(draft.trim())
                setDraft("")
              }}
            >
              {comments.length ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileDiff({
  file,
  viewed,
  onViewed,
  threads,
  onComment,
  resolved,
  onResolve,
}: {
  file: DiffFile
  viewed: boolean
  onViewed: (viewed: boolean) => void
  threads: Record<string, Comment[]>
  onComment: (key: string, body: string) => void
  resolved: Set<string>
  onResolve: (key: string, resolved: boolean) => void
}) {
  const [composing, setComposing] = useState<number | null>(null)
  const adds = file.lines.filter((l) => l.type === "add").length
  const dels = file.lines.filter((l) => l.type === "del").length

  return (
    <section
      id={`diff-${file.path}`}
      className="scroll-mt-4 overflow-hidden rounded-(--studio-radius-card) border"
    >
      <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
        <Button
          variant="quiet"
          size="xs"
          isIconOnly
          aria-label={viewed ? "Expand file" : "Collapse file"}
          onPress={() => onViewed(!viewed)}
        >
          {viewed ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </Button>
        <span className="min-w-0 truncate font-mono text-xs">{file.path}</span>
        {file.status === "added" && (
          <Badge size="sm" variant="success">
            New
          </Badge>
        )}
        <span className="font-mono text-xs text-fg-success">+{adds}</span>
        {dels > 0 && (
          <span className="font-mono text-xs text-fg-danger">−{dels}</span>
        )}
        <Button
          variant="quiet"
          size="xs"
          isIconOnly
          aria-label="Copy path"
          onPress={() => void navigator.clipboard?.writeText(file.path)}
        >
          <CopyIcon />
        </Button>
        <Checkbox
          isSelected={viewed}
          onChange={onViewed}
          className="ml-auto text-xs"
        >
          <CheckboxControl />
          <Label className="font-normal">Viewed</Label>
        </Checkbox>
      </div>
      {!viewed && (
        <div className="overflow-x-auto font-mono text-xs leading-5">
          {file.lines.map((line, index) => {
            const key = `${file.path}:${index}`
            const thread = threads[key]
            if (line.type === "hunk") {
              return (
                <div
                  key={index}
                  className="bg-accent-muted/50 px-4 py-1 text-fg-muted"
                >
                  {line.text}
                </div>
              )
            }
            return (
              <div key={index}>
                <div
                  className={cn(
                    "group/line grid min-w-max grid-cols-[2.75rem_2.75rem_1.5rem_1fr]",
                    line.type === "add" && "bg-success-muted/60",
                    line.type === "del" && "bg-danger-muted/60",
                  )}
                >
                  <span className="relative pr-2 text-right text-fg-muted select-none">
                    {line.old ?? ""}
                    <button
                      type="button"
                      aria-label={`Comment on line ${line.new ?? line.old}`}
                      onClick={() => setComposing(index)}
                      className="absolute top-0.5 left-1 hidden size-4 cursor-interactive items-center justify-center rounded-(--studio-radius-detail) bg-primary text-fg-on-primary group-hover/line:flex focus-visible:flex"
                    >
                      <PlusIcon className="size-3" />
                    </button>
                  </span>
                  <span className="pr-2 text-right text-fg-muted select-none">
                    {line.new ?? ""}
                  </span>
                  <span
                    className={cn(
                      "text-center select-none",
                      line.type === "add" && "text-fg-success",
                      line.type === "del" && "text-fg-danger",
                    )}
                  >
                    {line.type === "add" ? "+" : line.type === "del" ? "−" : ""}
                  </span>
                  <span className="pr-4 whitespace-pre">{line.text}</span>
                </div>
                {thread && (
                  <Thread
                    comments={thread}
                    onReply={(body) => onComment(key, body)}
                    resolved={resolved.has(key)}
                    onResolve={(isResolved) => onResolve(key, isResolved)}
                  />
                )}
                {composing === index && !thread && (
                  <Thread
                    comments={[]}
                    onReply={(body) => {
                      onComment(key, body)
                      setComposing(null)
                    }}
                    onCancel={() => setComposing(null)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function SideSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-b px-5 py-4">
      <h2 className="pb-2.5 text-xs font-medium text-fg-muted">{title}</h2>
      {children}
    </section>
  )
}

type Review = "pending" | "approved" | "changes"

function MergeSidebar({
  review,
  merged,
  unresolved,
}: {
  review: Review
  merged: boolean
  unresolved: number
}) {
  const requirements = [
    {
      label:
        review === "approved"
          ? "Approved by you"
          : review === "changes"
            ? "Changes requested"
            : "1 approval required",
      met: review === "approved",
    },
    { label: "4 of 5 checks passed", met: false, pending: true },
    { label: "No conflicts with main", met: true },
    {
      label: `${unresolved} unresolved ${unresolved === 1 ? "thread" : "threads"}`,
      met: unresolved === 0,
    },
  ]

  return (
    <aside
      aria-label="Pull request details"
      className="hidden w-72 shrink-0 overflow-y-auto border-l xl:block"
    >
      <SideSection title="Merge status">
        {merged ? (
          <p className="flex items-center gap-2 text-sm text-fg-accent compact:text-xs">
            <CircleCheckIcon className="size-4" />
            Merged into main
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {requirements.map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-2 text-sm compact:text-xs"
              >
                {r.met ? (
                  <CircleCheckIcon className="size-4 text-fg-success" />
                ) : r.pending ? (
                  <LoaderCircleIcon className="size-4 animate-spin text-fg-warning" />
                ) : (
                  <XCircleIcon className="size-4 text-fg-muted" />
                )}
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </SideSection>
      <SideSection title="Reviewers">
        <ul className="flex flex-col gap-2.5">
          {[
            { name: "Marcus Lee", state: "Commented" },
            {
              name: "You",
              state:
                review === "approved"
                  ? "Approved"
                  : review === "changes"
                    ? "Requested changes"
                    : "Review requested",
            },
          ].map((reviewer) => (
            <li
              key={reviewer.name}
              className="flex items-center gap-2.5 text-sm compact:text-xs"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials(reviewer.name)}</AvatarFallback>
              </Avatar>
              <span className="flex-1">{reviewer.name}</span>
              <span
                className={cn(
                  "text-xs",
                  reviewer.state === "Approved"
                    ? "text-fg-success"
                    : reviewer.state === "Requested changes"
                      ? "text-fg-danger"
                      : "text-fg-muted",
                )}
              >
                {reviewer.state}
              </span>
            </li>
          ))}
        </ul>
      </SideSection>
      <SideSection title="Checks">
        <ul className="flex flex-col gap-2">
          {CHECKS.map((check) => (
            <li
              key={check.name}
              className="flex items-center gap-2 text-sm compact:text-xs"
            >
              {check.status === "passed" ? (
                <CheckIcon className="size-3.5 text-fg-success" />
              ) : (
                <LoaderCircleIcon className="size-3.5 animate-spin text-fg-warning" />
              )}
              <span className="flex-1 font-mono text-xs">{check.name}</span>
              <span className="text-xs text-fg-muted tabular-nums">
                {check.time}
              </span>
            </li>
          ))}
        </ul>
      </SideSection>
      <SideSection title="Labels">
        <div className="flex flex-wrap gap-1.5">
          <Badge size="sm" variant="neutral">
            checkout
          </Badge>
          <Badge size="sm" variant="neutral">
            payments
          </Badge>
        </div>
      </SideSection>
    </aside>
  )
}

export default function CodeReviewBlock() {
  const [threads, setThreads] = useState(INITIAL_THREADS)
  const [viewed, setViewed] = useState<Set<string>>(new Set())
  const [review, setReview] = useState<Review>("pending")
  const [merged, setMerged] = useState(false)
  const [resolved, setResolved] = useState<Set<string>>(new Set())

  const comment = (key: string, body: string) =>
    setThreads((current) => ({
      ...current,
      [key]: [...(current[key] ?? []), { author: "You", time: "now", body }],
    }))
  const setFileViewed = (path: string, isViewed: boolean) =>
    setViewed((current) => {
      const next = new Set(current)
      if (isViewed) next.add(path)
      else next.delete(path)
      return next
    })
  const resolveThread = (key: string, isResolved: boolean) =>
    setResolved((current) => {
      const next = new Set(current)
      if (isResolved) next.add(key)
      else next.delete(key)
      return next
    })
  const unresolved = Object.keys(threads).filter((k) => !resolved.has(k)).length
  const adds = FILES.flatMap((f) => f.lines).filter(
    (l) => l.type === "add",
  ).length
  const dels = FILES.flatMap((f) => f.lines).filter(
    (l) => l.type === "del",
  ).length

  return (
    <div className="flex h-svh min-h-svh flex-col bg-bg text-fg">
      <header className="shrink-0 border-b px-4 pt-3 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-fg-muted compact:text-xs">
          <BrandMark className="size-5">
            <span className="flex size-5 items-center justify-center rounded-(--studio-radius-item) bg-fg text-[10px] font-semibold text-bg">
              N
            </span>
          </BrandMark>
          <BrandName>northwind</BrandName>
          <span>/</span>
          <span className="text-fg">storefront</span>
          <span>/</span>
          <span>#482</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-lg font-semibold sm:text-xl">
            Apply gift cards to checkout totals
          </h1>
          {merged ? (
            <Badge variant="accent">Merged</Badge>
          ) : review === "approved" ? (
            <Badge variant="success">Approved</Badge>
          ) : review === "changes" ? (
            <Badge variant="danger">Changes requested</Badge>
          ) : (
            <Badge variant="warning">Needs review</Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Menu>
              <Button variant="quiet" size="sm" isIconOnly aria-label="More">
                <MoreHorizontalIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent className="min-w-48">
                  <MenuItem>Copy branch name</MenuItem>
                  <MenuItem>Open on GitHub</MenuItem>
                  <MenuItem>Convert to draft</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
            <Menu>
              <Button variant="secondary" size="sm" isDisabled={merged}>
                Review
                <ChevronDownIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent
                  className="min-w-56"
                  onAction={(key) => setReview(key as Review)}
                >
                  <MenuSection>
                    <MenuSectionHeader>Submit review</MenuSectionHeader>
                    <MenuItem id="approved">
                      <CircleCheckIcon />
                      Approve
                    </MenuItem>
                    <MenuItem id="changes">
                      <XCircleIcon />
                      Request changes
                    </MenuItem>
                    <MenuItem id="pending">
                      <MessageSquareIcon />
                      Comment only
                    </MenuItem>
                  </MenuSection>
                </MenuContent>
              </Popover>
            </Menu>
            <Button
              variant="primary"
              size="sm"
              isDisabled={review !== "approved" || merged}
              onPress={() => setMerged(true)}
            >
              {merged ? "Merged" : "Merge"}
            </Button>
          </div>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-fg-muted compact:text-xs">
          <span className="text-fg">Priya Raman</span> wants to merge
          <code className="rounded-(--studio-radius-detail) bg-muted px-1.5 py-0.5 font-mono text-xs text-fg">
            priya/gift-card-totals
          </code>
          into
          <code className="rounded-(--studio-radius-detail) bg-muted px-1.5 py-0.5 font-mono text-xs text-fg">
            priya/gift-card-model
          </code>
        </p>
        <Tabs defaultSelectedKey="files" className="mt-2">
          <TabList
            variant="line"
            aria-label="Pull request"
            className="border-b-0"
          >
            <Tab id="overview">Overview</Tab>
            <Tab id="files">
              Files
              <Badge size="sm" variant="neutral" className="ml-1.5">
                {FILES.length}
              </Badge>
            </Tab>
            <Tab id="checks">
              Checks
              <Badge size="sm" variant="neutral" className="ml-1.5">
                {CHECKS.length}
              </Badge>
            </Tab>
          </TabList>
        </Tabs>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Stack and files"
          className="hidden w-64 shrink-0 overflow-y-auto border-r lg:block"
        >
          <StackPanel />
          <Separator />
          <FileTree
            viewed={viewed}
            onJump={(path) =>
              document
                .getElementById(`diff-${path}`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-center gap-3 text-sm text-fg-muted compact:text-xs">
              <span>
                {FILES.length} files ·{" "}
                <span className="text-fg-success">+{adds}</span>{" "}
                <span className="text-fg-danger">−{dels}</span>
              </span>
              <span className="ml-auto">
                {unresolved} unresolved{" "}
                {unresolved === 1 ? "thread" : "threads"}
              </span>
            </div>
            {FILES.map((file) => (
              <FileDiff
                key={file.path}
                file={file}
                viewed={viewed.has(file.path)}
                onViewed={(isViewed) => setFileViewed(file.path, isViewed)}
                threads={threads}
                onComment={comment}
                resolved={resolved}
                onResolve={resolveThread}
              />
            ))}
          </div>
        </main>

        <MergeSidebar review={review} merged={merged} unresolved={unresolved} />
      </div>
    </div>
  )
}
