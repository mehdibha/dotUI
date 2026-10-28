import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  BookIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleOffIcon,
  CodeIcon,
  FileCodeIcon,
  GitBranchIcon,
  ListFilterIcon,
  MessageSquareIcon,
  SaveIcon,
  SearchIcon,
  StarIcon,
  User2Icon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Sheet } from "@/registry/ui/sheet"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { BrandMark } from "@/modules/studio/assets/brand"

import { PagePicker, initials } from "./shared"

// A GitHub-style search page. The query is the single source of truth:
// facets in the rail write qualifiers (language:, state:) into it, and every
// count, result and highlight is read back from it.

type Kind = "code" | "repositories" | "issues" | "pulls" | "users"

const DEFAULT_QUERY = "gift card org:northwind"
const PAGE_SIZE = 10

const LANGUAGES = [
  { id: "TypeScript", color: "bg-(--chart-1)", files: 128 },
  { id: "Go", color: "bg-(--chart-2)", files: 46 },
  { id: "SQL", color: "bg-(--chart-3)", files: 18 },
  { id: "Markdown", color: "bg-(--chart-4)", files: 22 },
]

const LANGUAGE_COLOR = Object.fromEntries(LANGUAGES.map((l) => [l.id, l.color]))

interface Line {
  n: number
  text: string
}

interface CodeResult {
  repo: string
  path: string
  language: string
  lines: Line[]
  // Further matches in the same file, revealed by "Show more matches".
  more: Line[]
  indexed: number
}

const CODE: CodeResult[] = [
  {
    repo: "northwind/storefront",
    path: "src/checkout/gift-card.ts",
    language: "TypeScript",
    lines: [
      { n: 8, text: "export async function lookupGiftCard(code: string) {" },
      {
        n: 9,
        text: "  const card = await db.giftCards.find({ code: code.trim() })",
      },
      { n: 10, text: "  return card && card.balance > 0 ? card : null" },
    ],
    more: [
      { n: 24, text: "export function maskGiftCard(code: string) {" },
      { n: 31, text: "  // A gift card can be redeemed once per order." },
      { n: 32, text: "  if (order.giftCardId) throw new GiftCardInUseError()" },
    ],
    indexed: 40,
  },
  {
    repo: "northwind/storefront",
    path: "src/checkout/totals.ts",
    language: "TypeScript",
    lines: [
      { n: 15, text: "  const giftCardApplied = giftCard" },
      { n: 16, text: "    ? Math.min(giftCard.balance, subtotal - discount)" },
      { n: 17, text: "    : 0" },
    ],
    more: [
      { n: 22, text: "  return { subtotal, tax, giftCardApplied, total }" },
    ],
    indexed: 90,
  },
  {
    repo: "northwind/payments",
    path: "internal/giftcard/redeem.go",
    language: "Go",
    lines: [
      {
        n: 41,
        text: "func (s *Service) Redeem(ctx context.Context, code string, amount int64) error {",
      },
      { n: 42, text: "\tcard, err := s.store.GiftCard(ctx, code)" },
      {
        n: 43,
        text: "\tif card.Balance < amount { return ErrInsufficientBalance }",
      },
    ],
    more: [],
    indexed: 1440,
  },
  {
    repo: "northwind/payments",
    path: "migrations/0042_gift_cards.sql",
    language: "SQL",
    lines: [
      { n: 1, text: "CREATE TABLE gift_cards (" },
      { n: 2, text: "  code text PRIMARY KEY," },
      {
        n: 3,
        text: "  balance_cents bigint NOT NULL CHECK (balance_cents >= 0),",
      },
    ],
    more: [
      {
        n: 9,
        text: "CREATE INDEX gift_cards_order_idx ON gift_cards (order_id);",
      },
      {
        n: 12,
        text: "COMMENT ON TABLE gift_cards IS 'Stored value, never discounts';",
      },
    ],
    indexed: 8640,
  },
  {
    repo: "northwind/docs",
    path: "guides/payments/gift-cards.md",
    language: "Markdown",
    lines: [
      { n: 3, text: "Gift cards are a form of payment, not a discount." },
      {
        n: 4,
        text: "Apply the gift card after tax so the customer is taxed on the full price.",
      },
    ],
    more: [
      { n: 18, text: "## Refunding an order paid with a gift card" },
      {
        n: 20,
        text: "The refund goes back to the card, never to the original card holder's bank.",
      },
    ],
    indexed: 4320,
  },
]

const REPOSITORIES = [
  {
    name: "northwind/storefront",
    description:
      "The Northwind web store: catalog, cart, checkout and gift card redemption.",
    topics: ["nextjs", "checkout", "commerce"],
    language: "TypeScript",
    stars: 214,
    updated: 120,
    updatedLabel: "Updated 2 hours ago",
  },
  {
    name: "northwind/payments",
    description: "Payment, refund and gift card ledger service.",
    topics: ["go", "payments", "ledger"],
    language: "Go",
    stars: 98,
    updated: 1440,
    updatedLabel: "Updated yesterday",
  },
  {
    name: "northwind/gift-card-designs",
    description:
      "Printable and email gift card templates for the holiday season.",
    topics: ["design", "email"],
    language: "Markdown",
    stars: 12,
    updated: 63000,
    updatedLabel: "Updated on Sep 14",
  },
]

type IssueState =
  | "open"
  | "completed"
  | "not-planned"
  | "draft"
  | "merged"
  | "closed"

interface Issue {
  kind: "issues" | "pulls"
  state: IssueState
  title: string
  repo: string
  number: number
  body: string
  labels: string[]
  author: string
  comments: number
  updated: number
  updatedLabel: string
}

const ISSUES: Issue[] = [
  {
    kind: "issues",
    state: "open",
    title: "Gift card balance is taxed twice at checkout",
    repo: "northwind/storefront",
    number: 1182,
    body: "When a gift card covers part of the order, tax is computed after the card is applied…",
    labels: ["bug", "checkout"],
    author: "ecarter",
    comments: 7,
    updated: 180,
    updatedLabel: "updated 3 hours ago",
  },
  {
    kind: "issues",
    state: "open",
    title: "Show remaining gift card balance on the receipt",
    repo: "northwind/storefront",
    number: 1170,
    body: "Customers email support to ask what is left on their card after an order.",
    labels: ["enhancement"],
    author: "priyaraman",
    comments: 2,
    updated: 2880,
    updatedLabel: "updated 2 days ago",
  },
  {
    kind: "issues",
    state: "completed",
    title: "Rate limit gift card lookups",
    repo: "northwind/payments",
    number: 311,
    body: "Codes are short enough to guess if someone scripts the redeem endpoint.",
    labels: ["security"],
    author: "mlee",
    comments: 12,
    updated: 37000,
    updatedLabel: "closed on Oct 2",
  },
  {
    kind: "issues",
    state: "not-planned",
    title: "Let customers split a gift card between two orders",
    repo: "northwind/storefront",
    number: 1094,
    body: "Partial redemption already covers this; a second order just uses the balance.",
    labels: ["question"],
    author: "jnovak",
    comments: 4,
    updated: 52000,
    updatedLabel: "closed on Sep 21",
  },
  {
    kind: "pulls",
    state: "open",
    title: "Apply gift cards to checkout totals",
    repo: "northwind/storefront",
    number: 482,
    body: "Stacked on #481. Adds the gift card deduction to totals() and tests for the cap.",
    labels: ["checkout", "payments"],
    author: "priyaraman",
    comments: 3,
    updated: 60,
    updatedLabel: "updated 1 hour ago",
  },
  {
    kind: "pulls",
    state: "draft",
    title: "Gift card balance on the order receipt",
    repo: "northwind/storefront",
    number: 486,
    body: "Work in progress for #1170. Needs the balance endpoint from payments first.",
    labels: ["enhancement"],
    author: "ecarter",
    comments: 0,
    updated: 300,
    updatedLabel: "updated 5 hours ago",
  },
  {
    kind: "pulls",
    state: "merged",
    title: "Add GiftCard model and balance lookup",
    repo: "northwind/storefront",
    number: 481,
    body: "Introduces the GiftCard type and lookupGiftCard() backed by the gift_cards table.",
    labels: ["payments"],
    author: "priyaraman",
    comments: 5,
    updated: 1440,
    updatedLabel: "merged yesterday",
  },
  {
    kind: "pulls",
    state: "closed",
    title: "Store gift card balances in cents as floats",
    repo: "northwind/payments",
    number: 207,
    body: "Superseded by the bigint migration in 0042_gift_cards.sql.",
    labels: ["payments"],
    author: "jnovak",
    comments: 9,
    updated: 70000,
    updatedLabel: "closed on Aug 30",
  },
]

const USERS = [
  {
    name: "Priya Raman",
    login: "priyaraman",
    bio: "Payments at Northwind. Gift cards, refunds and everything that touches money.",
    location: "Toronto",
    repos: 34,
    followers: 812,
  },
  {
    name: "Marcus Lee",
    login: "mlee",
    bio: "Security engineer. Ask me about rate limits and gift card fraud.",
    location: "Berlin",
    repos: 21,
    followers: 1460,
  },
]

const KINDS: {
  id: Kind
  label: string
  noun: string
  icon: typeof CodeIcon
}[] = [
  { id: "code", label: "Code", noun: "files", icon: CodeIcon },
  {
    id: "repositories",
    label: "Repositories",
    noun: "repositories",
    icon: BookIcon,
  },
  { id: "issues", label: "Issues", noun: "issues", icon: CircleDotIcon },
  {
    id: "pulls",
    label: "Pull requests",
    noun: "pull requests",
    icon: GitBranchIcon,
  },
  { id: "users", label: "Users", noun: "users", icon: User2Icon },
]

const SORTS: Record<Kind, string[]> = {
  code: ["Best match", "Recently indexed"],
  repositories: ["Best match", "Most stars", "Recently updated"],
  issues: ["Best match", "Most commented", "Recently updated"],
  pulls: ["Best match", "Most commented", "Recently updated"],
  users: ["Best match", "Most followers", "Most repositories"],
}

const ADVANCED: Record<Kind, string[]> = {
  code: ["repo", "path", "symbol"],
  repositories: ["topic", "stars"],
  issues: ["author", "label"],
  pulls: ["author", "label"],
  users: ["location", "followers"],
}

const LABEL_VARIANT: Record<
  string,
  "neutral" | "danger" | "info" | "success" | "warning" | "accent"
> = {
  bug: "danger",
  security: "warning",
  enhancement: "info",
  checkout: "accent",
  payments: "success",
}

// MARK: Query

function parse(query: string) {
  const words: string[] = []
  const qualifiers: Record<string, string> = {}
  for (const token of query.trim().split(/\s+/)) {
    const [key, ...rest] = token.split(":")
    const value = rest.join(":")
    if (rest.length === 0) {
      if (token) words.push(token.toLowerCase())
    } else if (key && value) {
      qualifiers[key.toLowerCase()] = value.toLowerCase()
    }
  }
  return { words, qualifiers }
}

// Sets or clears one qualifier, leaving the rest of the query as typed.
function withQualifier(query: string, key: string, value: string | null) {
  const kept = query
    .trim()
    .split(/\s+/)
    .filter((token) => token && !token.toLowerCase().startsWith(`${key}:`))
  return [...kept, ...(value ? [`${key}:${value}`] : [])].join(" ")
}

function matches(text: string, words: string[]) {
  const haystack = text.toLowerCase().replace(/[_-]/g, " ")
  return words.length === 0 || words.some((w) => haystack.includes(w))
}

function inOwner(repo: string, qualifiers: Record<string, string>) {
  const owner = qualifiers.org ?? qualifiers.owner ?? qualifiers.user
  if (owner && !repo.toLowerCase().startsWith(`${owner}/`)) return false
  return !qualifiers.repo || repo.toLowerCase() === qualifiers.repo
}

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>
  const pattern = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  )
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            className="rounded-(--studio-radius-detail) bg-warning-muted text-fg"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

// MARK: Results

function RepoLabel({ repo }: { repo: string }) {
  return (
    <span className="flex items-center gap-2 text-sm compact:text-xs">
      <Avatar size="sm" className="size-5">
        <AvatarFallback className="text-[10px]">
          {repo[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-fg-muted">{repo}</span>
    </span>
  )
}

function LanguageDot({ language }: { language: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn("size-2.5 rounded-full", LANGUAGE_COLOR[language])}
      />
      {language}
    </span>
  )
}

function CodeItem({ result, words }: { result: CodeResult; words: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const lines = expanded ? [...result.lines, ...result.more] : result.lines
  return (
    <li className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <RepoLabel repo={result.repo} />
        <span aria-hidden className="text-fg-muted">
          ·
        </span>
        <a
          href="#"
          className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-fg-accent hover:underline compact:text-xs"
        >
          <FileCodeIcon className="size-3.5 shrink-0" />
          <span className="truncate">
            <Highlight text={result.path} words={words} />
          </span>
        </a>
      </div>
      <div className="overflow-hidden rounded-(--studio-radius-card) border">
        <pre className="overflow-x-auto py-1.5 font-mono text-xs leading-5">
          {lines.map((line, index) => (
            <div
              key={line.n}
              className={cn(
                "flex",
                index > 0 &&
                  line.n - (lines[index - 1]?.n ?? 0) > 1 &&
                  "mt-1.5 border-t border-dashed pt-1.5",
              )}
            >
              <span className="w-12 shrink-0 pr-3 text-right text-fg-muted select-none">
                {line.n}
              </span>
              <span className="pr-4">
                <Highlight text={line.text} words={words} />
              </span>
            </div>
          ))}
        </pre>
        {result.more.length > 0 && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            className="flex w-full cursor-interactive items-center gap-1.5 border-t bg-muted/50 px-3 py-1.5 text-left text-xs text-fg-muted hover:text-fg focus-visible:focus-ring [&_svg]:size-3.5"
          >
            {expanded ? (
              <>
                <ChevronUpIcon />
                Show fewer matches
              </>
            ) : (
              <>
                <ChevronDownIcon />
                Show {result.more.length} more{" "}
                {result.more.length === 1 ? "match" : "matches"}
              </>
            )}
          </button>
        )}
      </div>
      <span className="text-xs text-fg-muted">
        <LanguageDot language={result.language} />
      </span>
    </li>
  )
}

function RepositoryItem({
  repo,
  words,
}: {
  repo: (typeof REPOSITORIES)[number]
  words: string[]
}) {
  const [starred, setStarred] = useState(false)
  const stars = repo.stars + (starred ? 1 : 0)
  return (
    <li className="flex gap-3 border-b pb-6 last:border-b-0">
      <Avatar size="sm" className="mt-0.5 size-5">
        <AvatarFallback className="text-[10px]">
          {repo.name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <a href="#" className="font-medium text-fg-accent hover:underline">
          <Highlight text={repo.name} words={words} />
        </a>
        <p className="text-sm text-fg-muted compact:text-xs">
          <Highlight text={repo.description} words={words} />
        </p>
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <Badge key={topic} size="sm" variant="accent" appearance="soft">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted">
          <LanguageDot language={repo.language} />
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5" />
            {stars}
          </span>
          <span>{repo.updatedLabel}</span>
        </div>
      </div>
      <ToggleButton
        size="sm"
        isSelected={starred}
        onChange={setStarred}
        aria-label={starred ? `Unstar ${repo.name}` : `Star ${repo.name}`}
        className="self-start"
      >
        <StarIcon className={cn(starred && "fill-current text-fg-warning")} />
        {starred ? "Starred" : "Star"}
      </ToggleButton>
    </li>
  )
}

const STATE_ICON: Record<
  IssueState,
  { icon: typeof CodeIcon; color: string; label: string }
> = {
  open: { icon: CircleDotIcon, color: "text-fg-success", label: "Open" },
  completed: {
    icon: CircleCheckIcon,
    color: "text-fg-accent",
    label: "Closed as completed",
  },
  "not-planned": {
    icon: CircleOffIcon,
    color: "text-fg-muted",
    label: "Closed as not planned",
  },
  draft: { icon: CircleDashedIcon, color: "text-fg-muted", label: "Draft" },
  merged: { icon: GitBranchIcon, color: "text-fg-accent", label: "Merged" },
  closed: { icon: GitBranchIcon, color: "text-fg-danger", label: "Closed" },
}

function IssueItem({ issue, words }: { issue: Issue; words: string[] }) {
  const state =
    issue.kind === "pulls" && issue.state === "open"
      ? { icon: GitBranchIcon, color: "text-fg-success", label: "Open" }
      : STATE_ICON[issue.state]
  return (
    <li className="flex gap-3 border-b pb-6 last:border-b-0">
      <state.icon
        role="img"
        aria-label={state.label}
        className={cn("mt-0.5 size-4 shrink-0", state.color)}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-fg-muted">
          {issue.repo} · #{issue.number}
        </p>
        <a
          href="#"
          className="mt-0.5 block font-medium text-fg-accent hover:underline"
        >
          <Highlight text={issue.title} words={words} />
        </a>
        <p className="mt-1 text-sm text-fg-muted compact:text-xs">
          <Highlight text={issue.body} words={words} />
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
          {issue.labels.map((label) => (
            <Badge
              key={label}
              size="sm"
              appearance="soft"
              variant={LABEL_VARIANT[label] ?? "neutral"}
            >
              {label}
            </Badge>
          ))}
          <span>
            {issue.author} {issue.updatedLabel}
          </span>
        </div>
      </div>
      {issue.comments > 0 && (
        <span className="flex items-center gap-1 self-start text-xs text-fg-muted tabular-nums">
          <MessageSquareIcon className="size-3.5" />
          <span className="sr-only">Comments:</span>
          {issue.comments}
        </span>
      )}
    </li>
  )
}

function UserItem({
  user,
  words,
}: {
  user: (typeof USERS)[number]
  words: string[]
}) {
  const [following, setFollowing] = useState(false)
  return (
    <li className="flex gap-3 border-b pb-6 last:border-b-0">
      <Avatar>
        <AvatarFallback>{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm compact:text-xs">
          <a href="#" className="font-medium text-fg-accent hover:underline">
            <Highlight text={user.name} words={words} />
          </a>{" "}
          <span className="text-fg-muted">{user.login}</span>
        </p>
        <p className="mt-1 text-sm text-fg-muted compact:text-xs">
          <Highlight text={user.bio} words={words} />
        </p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
          <span>{user.location}</span>
          <span>{user.repos} repositories</span>
          <span>
            {(user.followers + (following ? 1 : 0)).toLocaleString()} followers
          </span>
        </p>
      </div>
      <ToggleButton
        size="sm"
        isSelected={following}
        onChange={setFollowing}
        className="self-start"
      >
        {following ? "Following" : "Follow"}
      </ToggleButton>
    </li>
  )
}

// MARK: Rail

function FacetButton({
  active,
  current,
  onPress,
  children,
  count,
}: {
  active?: boolean
  current?: boolean
  onPress: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={current ? undefined : active}
      aria-current={current && active ? "page" : undefined}
      onClick={onPress}
      className={cn(
        "relative flex w-full cursor-interactive items-center gap-2.5 rounded-(--studio-radius-item) px-2.5 py-1.5 text-left text-sm focus-visible:focus-ring compact:text-xs [&_svg]:size-4 [&_svg]:text-fg-muted",
        active ? "bg-muted font-medium" : "hover:bg-muted",
      )}
    >
      {active && current && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 -left-2 w-1 rounded-(--studio-radius-pill) bg-primary"
        />
      )}
      {children}
      {count !== undefined && (
        <span className="ml-auto text-xs font-normal text-fg-muted tabular-nums">
          {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
        </span>
      )}
    </button>
  )
}

function RailSection({
  title,
  children,
  divided = true,
}: {
  title: string
  children: ReactNode
  divided?: boolean
}) {
  return (
    <section className={cn(divided && "border-t pt-4")}>
      <h2 className="px-2.5 pb-2 text-sm font-medium compact:text-xs">
        {title}
      </h2>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </section>
  )
}

// MARK: Block

export default function SearchResultsBlock() {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [kind, setKind] = useState<Kind>("code")
  const [sort, setSort] = useState("Best match")
  const [page, setPage] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)

  // "/" jumps to the search box from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        event.key !== "/" ||
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const { words, qualifiers } = parse(query)
  const language = LANGUAGES.find(
    (l) => l.id.toLowerCase() === qualifiers.language,
  )?.id
  const state = qualifiers.state

  const updateQuery = (next: string) => {
    setQuery(next)
    setPage(1)
  }

  const code = CODE.filter(
    (r) =>
      inOwner(r.repo, qualifiers) &&
      (!qualifiers.language ||
        r.language.toLowerCase() === qualifiers.language) &&
      (!qualifiers.path || r.path.toLowerCase().includes(qualifiers.path)) &&
      matches(`${r.path} ${r.lines.map((l) => l.text).join(" ")}`, words),
  )
  const repos = REPOSITORIES.filter(
    (r) =>
      inOwner(r.name, qualifiers) &&
      (!qualifiers.language ||
        r.language.toLowerCase() === qualifiers.language) &&
      (!qualifiers.topic || r.topics.includes(qualifiers.topic)) &&
      matches(`${r.name} ${r.description}`, words),
  )
  const threads = (k: "issues" | "pulls") =>
    ISSUES.filter(
      (i) =>
        i.kind === k &&
        inOwner(i.repo, qualifiers) &&
        (!state ||
          (state === "open"
            ? ["open", "draft"]
            : ["completed", "not-planned", "merged", "closed"]
          ).includes(i.state)) &&
        (!qualifiers.author || i.author === qualifiers.author) &&
        (!qualifiers.label || i.labels.includes(qualifiers.label)) &&
        matches(`${i.title} ${i.body}`, words),
    )
  const users = USERS.filter(
    (u) =>
      (!qualifiers.location ||
        u.location.toLowerCase() === qualifiers.location) &&
      matches(`${u.name} ${u.login} ${u.bio}`, words),
  )

  // The sample stands in for the first page of a larger index: while the
  // query still finds every sample file, report the index's file count.
  const codeInScope = CODE.filter(
    (r) =>
      inOwner(r.repo, qualifiers) &&
      (!qualifiers.language ||
        r.language.toLowerCase() === qualifiers.language),
  )
  const reportsIndex =
    code.length > 0 &&
    code.length === codeInScope.length &&
    !qualifiers.path &&
    !qualifiers.repo
  const codeTotal = reportsIndex
    ? LANGUAGES.filter((l) => !language || l.id === language).reduce(
        (sum, l) => sum + l.files,
        0,
      )
    : code.length

  const counts: Record<Kind, number> = {
    code: codeTotal,
    repositories: repos.length,
    issues: threads("issues").length,
    pulls: threads("pulls").length,
    users: users.length,
  }
  const total = counts[kind]
  const current = KINDS.find((k) => k.id === kind) ?? KINDS[0]!
  const noun = total === 1 ? current.noun.replace(/s$/, "") : current.noun
  const pageCount = kind === "code" ? Math.ceil(total / PAGE_SIZE) : 1

  const by = <T,>(items: T[], key: (item: T) => number) =>
    [...items].sort((a, b) => key(b) - key(a))
  const sorted = {
    code: sort === "Recently indexed" ? by(code, (r) => -r.indexed) : code,
    repositories:
      sort === "Most stars"
        ? by(repos, (r) => r.stars)
        : sort === "Recently updated"
          ? by(repos, (r) => -r.updated)
          : repos,
    issues: [] as Issue[],
    users:
      sort === "Most followers"
        ? by(users, (u) => u.followers)
        : sort === "Most repositories"
          ? by(users, (u) => u.repos)
          : users,
  }
  if (kind === "issues" || kind === "pulls") {
    const list = threads(kind)
    sorted.issues =
      sort === "Most commented"
        ? by(list, (i) => i.comments)
        : sort === "Recently updated"
          ? by(list, (i) => -i.updated)
          : list
  }

  const filtered = Object.keys(qualifiers).some((k) => k !== "org")

  const rail = (close?: () => void) => (
    <div className="flex flex-col gap-4">
      <RailSection title="Filter by" divided={false}>
        {KINDS.map((k) => (
          <li key={k.id}>
            <FacetButton
              current
              active={kind === k.id}
              count={counts[k.id]}
              onPress={() => {
                setKind(k.id)
                setSort("Best match")
                setPage(1)
                close?.()
              }}
            >
              <k.icon />
              {k.label}
            </FacetButton>
          </li>
        ))}
      </RailSection>
      {(kind === "code" || kind === "repositories") && (
        <RailSection title="Languages">
          {LANGUAGES.map((l) => (
            <li key={l.id}>
              <FacetButton
                active={language === l.id}
                onPress={() =>
                  updateQuery(
                    withQualifier(
                      query,
                      "language",
                      language === l.id ? null : l.id,
                    ),
                  )
                }
              >
                <span
                  aria-hidden
                  className={cn("size-2.5 rounded-full", l.color)}
                />
                {l.id}
              </FacetButton>
            </li>
          ))}
        </RailSection>
      )}
      {(kind === "issues" || kind === "pulls") && (
        <RailSection title="State">
          {[
            { id: "open", label: "Open", icon: CircleDotIcon },
            {
              id: "closed",
              label: "Closed",
              icon: kind === "pulls" ? GitBranchIcon : CircleCheckIcon,
            },
          ].map((s) => (
            <li key={s.id}>
              <FacetButton
                active={state === s.id}
                onPress={() =>
                  updateQuery(
                    withQualifier(query, "state", state === s.id ? null : s.id),
                  )
                }
              >
                <s.icon />
                {s.label}
              </FacetButton>
            </li>
          ))}
        </RailSection>
      )}
      <RailSection title="Advanced">
        {["owner", ...ADVANCED[kind]].map((key) => (
          <li key={key}>
            <FacetButton
              onPress={() => {
                updateQuery(`${query.trim()} ${key}:`)
                close?.()
                inputRef.current?.focus()
              }}
            >
              <ListFilterIcon />
              <span className="capitalize">{key}</span>
            </FacetButton>
          </li>
        ))}
      </RailSection>
    </div>
  )

  return (
    <div className="flex min-h-svh flex-col bg-bg text-fg">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
        <BrandMark className="size-7">
          <span className="flex size-7 items-center justify-center rounded-full bg-fg text-xs font-semibold text-bg">
            N
          </span>
        </BrandMark>
        <SearchField
          aria-label="Search"
          value={query}
          onChange={updateQuery}
          className="w-full max-w-xl"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input ref={inputRef} placeholder="Search or jump to…" />
            <InputGroupAddon className="max-sm:hidden">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </SearchField>
        <Avatar size="sm" className="ml-auto">
          <AvatarFallback>EC</AvatarFallback>
        </Avatar>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 sm:px-6">
        <aside aria-label="Filters" className="hidden w-64 shrink-0 md:block">
          {rail()}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <Dialog>
              <Button variant="secondary" size="sm" className="md:hidden">
                <ListFilterIcon />
                Filters
              </Button>
              <Sheet>
                <DialogContent>
                  {({ close }) => (
                    <>
                      <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                      </DialogHeader>
                      <DialogBody>{rail(close)}</DialogBody>
                    </>
                  )}
                </DialogContent>
              </Sheet>
            </Dialog>
            <h1
              aria-live="polite"
              className="text-sm font-medium compact:text-xs"
            >
              {total.toLocaleString()} {noun}
              <span className="font-normal text-fg-muted"> (64 ms)</span>
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <Menu>
                <Button variant="secondary" size="sm">
                  <span className="text-fg-muted">Sort:</span> {sort}
                  <ChevronDownIcon />
                </Button>
                <Popover placement="bottom end">
                  <MenuContent
                    selectionMode="single"
                    selectedKeys={[sort]}
                    onAction={(key) => setSort(String(key))}
                  >
                    {SORTS[kind].map((s) => (
                      <MenuItem key={s} id={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </Popover>
              </Menu>
              <Button
                variant="secondary"
                size="sm"
                isIconOnly
                aria-label="Save search"
              >
                <SaveIcon />
              </Button>
            </div>
          </div>

          {total === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyTitle>
                  Your search did not match any {current.noun}
                </EmptyTitle>
                <EmptyDescription>
                  Try different keywords, or search across all of Northwind
                  instead of one filter.
                </EmptyDescription>
              </EmptyHeader>
              {filtered && (
                <EmptyContent>
                  <Button
                    variant="secondary"
                    size="sm"
                    onPress={() =>
                      updateQuery(
                        query
                          .trim()
                          .split(/\s+/)
                          .filter(
                            (t) =>
                              !t.includes(":") ||
                              t.toLowerCase().startsWith("org:"),
                          )
                          .join(" "),
                      )
                    }
                  >
                    Clear filters
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          ) : (
            <ul className="flex flex-col gap-6">
              {kind === "code"
                ? sorted.code.map((result) => (
                    <CodeItem
                      key={`${result.repo}/${result.path}`}
                      result={result}
                      words={words}
                    />
                  ))
                : kind === "repositories"
                  ? sorted.repositories.map((repo) => (
                      <RepositoryItem
                        key={repo.name}
                        repo={repo}
                        words={words}
                      />
                    ))
                  : kind === "users"
                    ? sorted.users.map((user) => (
                        <UserItem key={user.login} user={user} words={words} />
                      ))
                    : sorted.issues.map((issue) => (
                        <IssueItem
                          key={`${issue.repo}#${issue.number}`}
                          issue={issue}
                          words={words}
                        />
                      ))}
            </ul>
          )}

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center">
              <PagePicker
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
