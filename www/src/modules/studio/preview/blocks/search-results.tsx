import { useState } from "react"
import type { ReactNode } from "react"

import {
  BookIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CodeIcon,
  FileCodeIcon,
  GitBranchIcon,
  ListFilterIcon,
  MessageSquareIcon,
  SaveIcon,
  StarIcon,
  User2Icon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { BrandMark } from "@/modules/studio/assets/brand"

import { PagePicker, initials } from "./shared"

// A GitHub-style search page: result types with counts on the left,
// languages and repositories to narrow by, and results that change shape
// per type, with every match of the query highlighted in place.

type Kind = "code" | "repositories" | "issues" | "pulls" | "users"

const LANGUAGES = [
  { id: "TypeScript", color: "bg-(--chart-1)" },
  { id: "Go", color: "bg-(--chart-2)" },
  { id: "SQL", color: "bg-(--chart-3)" },
  { id: "Markdown", color: "bg-(--chart-4)" },
]

const LANGUAGE_COLOR = Object.fromEntries(LANGUAGES.map((l) => [l.id, l.color]))

interface CodeResult {
  repo: string
  path: string
  language: string
  lines: { n: number; text: string }[]
  more: number
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
    more: 3,
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
    more: 1,
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
    more: 0,
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
    more: 2,
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
    more: 4,
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
    updated: "Updated 2 hours ago",
  },
  {
    name: "northwind/payments",
    description: "Payment, refund and gift card ledger service.",
    topics: ["go", "payments", "ledger"],
    language: "Go",
    stars: 98,
    updated: "Updated yesterday",
  },
  {
    name: "northwind/gift-card-designs",
    description:
      "Printable and email gift card templates for the holiday season.",
    topics: ["design", "email"],
    language: "Markdown",
    stars: 12,
    updated: "Updated on Sep 14",
  },
]

const ISSUES = [
  {
    kind: "issues" as const,
    state: "open" as const,
    title: "Gift card balance is taxed twice at checkout",
    repo: "northwind/storefront",
    number: 1182,
    body: "When a gift card covers part of the order, tax is computed after the card is applied…",
    labels: ["bug", "checkout"],
    comments: 7,
    updated: "3 hours ago",
  },
  {
    kind: "pulls" as const,
    state: "open" as const,
    title: "Apply gift cards to checkout totals",
    repo: "northwind/storefront",
    number: 482,
    body: "Stacked on #481. Adds the gift card deduction to totals() and tests for the cap.",
    labels: ["checkout", "payments"],
    comments: 3,
    updated: "1 hour ago",
  },
  {
    kind: "issues" as const,
    state: "closed" as const,
    title: "Rate limit gift card lookups",
    repo: "northwind/payments",
    number: 311,
    body: "Codes are short enough to guess if someone scripts the redeem endpoint.",
    labels: ["security"],
    comments: 12,
    updated: "on Oct 2",
  },
  {
    kind: "pulls" as const,
    state: "closed" as const,
    title: "Add GiftCard model and balance lookup",
    repo: "northwind/storefront",
    number: 481,
    body: "Introduces the GiftCard type and lookupGiftCard() backed by the gift_cards table.",
    labels: ["payments"],
    comments: 5,
    updated: "yesterday",
  },
]

const USERS = [
  {
    name: "Priya Raman",
    login: "priyaraman",
    bio: "Payments at Northwind. Gift cards, refunds and everything that touches money.",
  },
  {
    name: "Marcus Lee",
    login: "mlee",
    bio: "Security engineer. Ask me about rate limits.",
  },
]

const KINDS: {
  id: Kind
  label: string
  icon: typeof CodeIcon
  total: number
}[] = [
  { id: "code", label: "Code", icon: CodeIcon, total: 214 },
  { id: "repositories", label: "Repositories", icon: BookIcon, total: 3 },
  { id: "issues", label: "Issues", icon: CircleDotIcon, total: 38 },
  { id: "pulls", label: "Pull requests", icon: GitBranchIcon, total: 21 },
  { id: "users", label: "Users", icon: User2Icon, total: 2 },
]

const SORTS = ["Best match", "Most stars", "Recently updated"]

function terms(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t && !t.includes(":"))
}

function matches(text: string, query: string) {
  const words = terms(query)
  const haystack = text.toLowerCase().replace(/[_-]/g, " ")
  return words.length === 0 || words.some((w) => haystack.includes(w))
}

function Highlight({ text, query }: { text: string; query: string }) {
  const words = terms(query)
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

function CodeItem({ result, query }: { result: CodeResult; query: string }) {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <RepoLabel repo={result.repo} />
        <span className="text-fg-muted">·</span>
        <a
          href="#"
          className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-fg-accent hover:underline compact:text-xs"
        >
          <FileCodeIcon className="size-3.5 shrink-0" />
          <span className="truncate">
            <Highlight text={result.path} query={query} />
          </span>
        </a>
      </div>
      <div className="overflow-hidden rounded-(--studio-radius-card) border">
        <pre className="overflow-x-auto py-1.5 font-mono text-xs leading-5">
          {result.lines.map((line) => (
            <div key={line.n} className="flex">
              <span className="w-12 shrink-0 pr-3 text-right text-fg-muted select-none">
                {line.n}
              </span>
              <span className="pr-4">
                <Highlight text={line.text} query={query} />
              </span>
            </div>
          ))}
        </pre>
        {result.more > 0 && (
          <button
            type="button"
            className="w-full cursor-interactive border-t bg-muted/50 px-3 py-1.5 text-left text-xs text-fg-muted hover:text-fg"
          >
            Show {result.more} more {result.more === 1 ? "match" : "matches"}
          </button>
        )}
      </div>
      <span className="text-xs text-fg-muted">
        <LanguageDot language={result.language} />
      </span>
    </li>
  )
}

function ResultList({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-6">{children}</ul>
}

function FilterButton({
  active,
  onPress,
  children,
  count,
}: {
  active?: boolean
  onPress: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onPress}
      className={cn(
        "relative flex w-full cursor-interactive items-center gap-2.5 rounded-(--studio-radius-item) px-2.5 py-1.5 text-left text-sm compact:text-xs [&_svg]:size-4 [&_svg]:text-fg-muted",
        active ? "bg-muted font-medium" : "hover:bg-muted",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 -left-2 w-1 rounded-full bg-primary"
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

export default function SearchResultsBlock() {
  const [query, setQuery] = useState("gift card org:northwind")
  const [kind, setKind] = useState<Kind>("code")
  const [language, setLanguage] = useState<string | null>(null)
  const [sort, setSort] = useState(SORTS[0] ?? "Best match")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const code = CODE.filter(
    (r) =>
      (!language || r.language === language) &&
      matches(`${r.path} ${r.lines.map((l) => l.text).join(" ")}`, query),
  )
  const repos = REPOSITORIES.filter(
    (r) =>
      (!language || r.language === language) &&
      matches(`${r.name} ${r.description}`, query),
  )
  const issues = ISSUES.filter(
    (i) => i.kind === kind && matches(`${i.title} ${i.body}`, query),
  )
  const users = USERS.filter((u) => matches(`${u.name} ${u.bio}`, query))

  const visibleCount =
    kind === "code"
      ? code.length
      : kind === "repositories"
        ? repos.length
        : kind === "users"
          ? users.length
          : issues.length
  const total =
    terms(query).length === 0
      ? 0
      : kind === "code" && !language
        ? 214
        : visibleCount
  const noun =
    kind === "code"
      ? "files"
      : KINDS.find((k) => k.id === kind)?.label.toLowerCase()

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
          onChange={(value) => {
            setQuery(value)
            setPage(1)
          }}
          className="w-full max-w-xl"
        />
        <Avatar size="sm" className="ml-auto">
          <AvatarFallback>EC</AvatarFallback>
        </Avatar>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 sm:px-6">
        <aside
          aria-label="Filters"
          className={cn(
            "w-64 shrink-0 flex-col gap-6",
            showFilters
              ? "max-md:fixed max-md:inset-0 max-md:z-20 max-md:flex max-md:overflow-y-auto max-md:bg-bg max-md:p-4"
              : "hidden md:flex",
          )}
        >
          <div className="flex items-center justify-between md:hidden">
            <span className="font-medium">Filters</span>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Close filters"
              onPress={() => setShowFilters(false)}
            >
              <XIcon />
            </Button>
          </div>
          <section>
            <h2 className="px-2.5 pb-2 text-sm font-medium compact:text-xs">
              Filter by
            </h2>
            <ul className="flex flex-col gap-0.5">
              {KINDS.map((k) => (
                <li key={k.id}>
                  <FilterButton
                    active={kind === k.id}
                    count={k.total}
                    onPress={() => {
                      setKind(k.id)
                      setPage(1)
                      setShowFilters(false)
                    }}
                  >
                    <k.icon />
                    {k.label}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </section>
          {(kind === "code" || kind === "repositories") && (
            <section className="border-t pt-4">
              <h2 className="px-2.5 pb-2 text-sm font-medium compact:text-xs">
                Languages
              </h2>
              <ul className="flex flex-col gap-0.5">
                {LANGUAGES.map((l) => (
                  <li key={l.id}>
                    <FilterButton
                      active={language === l.id}
                      onPress={() =>
                        setLanguage(language === l.id ? null : l.id)
                      }
                    >
                      <span
                        aria-hidden
                        className={cn("size-2.5 rounded-full", l.color)}
                      />
                      {l.id}
                    </FilterButton>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="border-t pt-4">
            <h2 className="px-2.5 pb-2 text-sm font-medium compact:text-xs">
              Advanced
            </h2>
            <ul className="flex flex-col gap-0.5">
              {["Owner", "Repository", "Path", "Symbol"].map((label) => (
                <li key={label}>
                  <FilterButton
                    onPress={() => setQuery(`${query} ${label.toLowerCase()}:`)}
                  >
                    <ListFilterIcon />
                    {label}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden"
              onPress={() => setShowFilters(true)}
            >
              <ListFilterIcon />
              Filters
            </Button>
            <h1 className="text-sm font-medium compact:text-xs">
              {total.toLocaleString()} {noun}
              <span className="font-normal text-fg-muted"> (64 ms)</span>
            </h1>
            {language && (
              <Badge size="sm" variant="neutral">
                language:{language}
                <button
                  type="button"
                  aria-label="Remove language filter"
                  className="-mr-1 flex cursor-interactive text-fg-muted hover:text-fg"
                  onClick={() => setLanguage(null)}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            )}
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
                    {SORTS.map((s) => (
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

          {visibleCount === 0 ? (
            <div className="rounded-(--studio-radius-card) border px-6 py-16 text-center">
              <p className="font-medium">
                Your search did not match any {noun}
              </p>
              <p className="mt-1 text-sm text-fg-muted compact:text-xs">
                Try different keywords, or remove a filter.
              </p>
            </div>
          ) : kind === "code" ? (
            <ResultList>
              {code.map((result) => (
                <CodeItem
                  key={`${result.repo}/${result.path}`}
                  result={result}
                  query={query}
                />
              ))}
            </ResultList>
          ) : kind === "repositories" ? (
            <ResultList>
              {repos.map((repo) => (
                <li
                  key={repo.name}
                  className="flex flex-col gap-2 border-b pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <a
                      href="#"
                      className="flex items-center gap-2 font-medium text-fg-accent hover:underline"
                    >
                      <BookIcon className="size-4 text-fg-muted" />
                      <span>
                        <Highlight text={repo.name} query={query} />
                      </span>
                    </a>
                    <Button variant="secondary" size="sm">
                      <StarIcon />
                      Star
                    </Button>
                  </div>
                  <p className="text-sm text-fg-muted compact:text-xs">
                    <Highlight text={repo.description} query={query} />
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.map((topic) => (
                      <Badge key={topic} size="sm" variant="neutral">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-fg-muted">
                    <LanguageDot language={repo.language} />
                    <span className="flex items-center gap-1">
                      <StarIcon className="size-3.5" />
                      {repo.stars}
                    </span>
                    <span>{repo.updated}</span>
                  </div>
                </li>
              ))}
            </ResultList>
          ) : kind === "users" ? (
            <ResultList>
              {users.map((user) => (
                <li
                  key={user.login}
                  className="flex gap-3 border-b pb-6 last:border-b-0"
                >
                  <Avatar>
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm compact:text-xs">
                      <span className="font-medium text-fg-accent">
                        {user.name}
                      </span>{" "}
                      <span className="text-fg-muted">{user.login}</span>
                    </p>
                    <p className="mt-1 text-sm text-fg-muted compact:text-xs">
                      <Highlight text={user.bio} query={query} />
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Follow
                  </Button>
                </li>
              ))}
            </ResultList>
          ) : (
            <ResultList>
              {issues.map((issue) => (
                <li
                  key={`${issue.repo}#${issue.number}`}
                  className="flex gap-3 border-b pb-6 last:border-b-0"
                >
                  {issue.kind === "pulls" ? (
                    <GitBranchIcon
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        issue.state === "open"
                          ? "text-fg-success"
                          : "text-fg-accent",
                      )}
                    />
                  ) : issue.state === "open" ? (
                    <CircleDotIcon className="mt-0.5 size-4 shrink-0 text-fg-success" />
                  ) : (
                    <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-fg-accent" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-fg-muted">
                      {issue.repo} · #{issue.number}
                    </p>
                    <a
                      href="#"
                      className="mt-0.5 block font-medium text-fg-accent hover:underline"
                    >
                      <Highlight text={issue.title} query={query} />
                    </a>
                    <p className="mt-1 text-sm text-fg-muted compact:text-xs">
                      <Highlight text={issue.body} query={query} />
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                      {issue.labels.map((label) => (
                        <Badge key={label} size="sm" variant="neutral">
                          {label}
                        </Badge>
                      ))}
                      <span>
                        {issue.state === "open" ? "Updated" : "Closed"}{" "}
                        {issue.updated}
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 self-start text-xs text-fg-muted">
                    <MessageSquareIcon className="size-3.5" />
                    {issue.comments}
                  </span>
                </li>
              ))}
            </ResultList>
          )}

          {kind === "code" && visibleCount > 0 && !language && (
            <div className="mt-8 flex justify-center">
              <PagePicker page={page} pageCount={22} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
