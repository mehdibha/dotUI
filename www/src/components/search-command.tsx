import React from 'react'
import type { ToOptions } from '@tanstack/react-router'
import type * as PageTree from 'fumadocs-core/page-tree'
import type { SortedResult } from 'fumadocs-core/search'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static'
import {
  ArrowRightIcon,
  CircleDashedIcon,
  ClockIcon,
  FileTextIcon,
  HashIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  TextIcon,
} from 'lucide-react'
import { Autocomplete, useFilter } from 'react-aria-components/Autocomplete'
import { useTheme } from 'starter-themes'

import { navItems, siteConfig } from '@/config/site'
import { Responsive } from '@/registry/lib/responsive'
import { useStyles as useCommandStyles } from '@/registry/ui/command/styles'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  MenuContent,
  MenuItem,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import {
  ModalBackdrop,
  ModalOverlay,
  ModalPanel,
  ModalViewport,
} from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'
import { GitHubIcon } from '@/components/icons/github'

// Module-level so the downloaded index and Orama db survive dialog re-opens —
// the index is fetched from /api/search once per page load, every query after
// that runs fully client-side.
const searchClient = oramaStaticClient({ from: '/api/search' })

const RECENT_KEY = 'dotui.search.recent'
const RECENT_LIMIT = 5

interface RecentEntry {
  title: string
  url: string
}

function readRecents(): RecentEntry[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (entry): entry is RecentEntry =>
          typeof entry === 'object' &&
          entry !== null &&
          typeof (entry as RecentEntry).title === 'string' &&
          typeof (entry as RecentEntry).url === 'string',
      )
      .slice(0, RECENT_LIMIT)
  } catch {
    return []
  }
}

function pushRecent(entry: RecentEntry) {
  try {
    const next = [
      entry,
      ...readRecents().filter((recent) => recent.url !== entry.url),
    ].slice(0, RECENT_LIMIT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // localStorage unavailable (private mode, quota) — recents just don't persist.
  }
}

/** Search result URLs are `/docs/...#anchor` strings; route them through the
 *  docs splat route so navigation stays client-side. */
function docsHref(url: string): string | ToOptions {
  const [path = '', hash] = url.split('#')
  if (path !== '/docs' && !path.startsWith('/docs/')) return url
  return {
    to: '/docs/$',
    params: { _splat: path.slice('/docs/'.length) },
    hash,
  }
}

const stripMarks = (content: string) =>
  content
    .replace(/<\/?mark>/g, '')
    .replaceAll('`', '')
    .replaceAll('**', '')

/** Result content arrives as text with `<mark>` around matched terms and
 *  occasional markdown syntax (inline-code backticks, bold markers). */
function Highlight({ text }: { text: string }) {
  const parts = text
    .replaceAll('`', '')
    .replaceAll('**', '')
    .split(/<mark>(.*?)<\/mark>/)
  if (parts.length === 1) return parts[0]
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      // oxlint-disable-next-line react/no-array-index-key -- static split output
      <mark key={index} className="rounded-xs bg-accent-muted text-current">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

interface ResultGroup {
  page: SortedResult
  children: SortedResult[]
}

/** Orama returns a flat list ordered page → its heading/text matches. */
function groupResults(results: SortedResult[]): ResultGroup[] {
  const groups: ResultGroup[] = []
  for (const result of results) {
    if (result.type === 'page') groups.push({ page: result, children: [] })
    else groups.at(-1)?.children.push(result)
  }
  return groups
}

interface SearchCommandProps {
  items: PageTree.Node[]
  keyboardShortcut?: boolean
  children: React.ReactNode
}

export function SearchCommand({
  items,
  keyboardShortcut = false,
  children,
}: SearchCommandProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!keyboardShortcut) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        const target = e.target
        if (
          (target instanceof HTMLElement && target.isContentEditable) ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [keyboardShortcut])

  return (
    <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      {/* Modal on desktop, Drawer on mobile; content remounts on open so the search resets. */}
      <Responsive
        render={(isMobile) => {
          const content = (
            <DialogContent
              aria-label="Search documentation"
              className="flex flex-col gap-0 overflow-hidden p-0!"
            >
              <SearchDialog items={items} onClose={() => setIsOpen(false)} />
            </DialogContent>
          )
          return isMobile ? (
            <Drawer>{content}</Drawer>
          ) : (
            // Composed (not <Modal>) so the panel AND backdrop appear
            // instantly — duration-0 on both. Mirror shadcn.com: max-w-lg
            // (512px), top-15%.
            <ModalOverlay>
              <ModalBackdrop className="duration-0 group-exiting/modal:duration-0" />
              <ModalViewport>
                <ModalPanel className="mt-[15vh] self-start duration-0 [--modal-background:var(--neutral-100)] [--modal-radius:var(--radius-xl)] sm:max-w-lg entering:scale-100 exiting:scale-100">
                  {content}
                </ModalPanel>
              </ModalViewport>
            </ModalOverlay>
          )
        }}
      />
    </Dialog>
  )
}

function SearchDialog({
  items,
  onClose,
}: {
  items: PageTree.Node[]
  onClose: () => void
}) {
  const commandStyles = useCommandStyles()
  const { resolvedTheme, setTheme } = useTheme()
  const { search, setSearch, query } = useDocsSearch({ client: searchClient })
  const [recents] = React.useState(readRecents)

  React.useEffect(() => {
    // Warm the index (download + build) while the user starts typing.
    void Promise.resolve(searchClient.search('')).catch(() => {})
  }, [])

  // Typing filters the default sections like a regular command palette. The
  // full-text index matches are appended as a separate "Search results"
  // section — nested matches (headings, body text) only, since page-level
  // hits duplicate the pages already listed in the default sections.
  const { contains } = useFilter({
    sensitivity: 'base',
    ignorePunctuation: true,
  })
  const term = search.trim()
  const matches = (text: string) => contains(text, term)

  const nestedResults = groupResults(
    term.length > 0 && Array.isArray(query.data) ? query.data : [],
  ).flatMap((group) =>
    group.children.map((child) => ({ page: group.page, child })),
  )
  const filteredRecents = recents.filter((recent) => matches(recent.title))
  const filteredNav = navItems.filter((item) => matches(item.name))

  // Item-level onAction suppresses the menu-level one, so this closes the
  // dialog itself.
  const rememberChild = (page: SortedResult, child: SortedResult) => {
    const pageTitle = stripMarks(page.content)
    pushRecent({
      title:
        child.type === 'heading'
          ? `${pageTitle} › ${stripMarks(child.content)}`
          : pageTitle,
      url: child.url,
    })
    onClose()
  }

  return (
    <Autocomplete inputValue={search} onInputChange={setSearch}>
      <div
        data-command=""
        className={commandStyles({ className: 'gap-0 overflow-y-hidden p-0' })}
      >
        <SearchField autoFocus aria-label="Search" className="px-1.5 pt-1.5">
          <InputGroup size="lg">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search documentation..." />
          </InputGroup>
        </SearchField>
        {/* The menu is the scroll container and must span the full panel
              width (scrollbar at the edge), so the list padding lives inside
              it rather than on the wrapper. */}
        <MenuContent
          aria-label="Search results"
          className="max-h-80 scroll-fade-y overflow-y-auto p-1.5 pt-0 **:data-menu-item:py-2"
          onAction={onClose}
          renderEmptyState={() => (
            <div className="py-8 text-center text-sm text-fg-muted">
              {query.error
                ? 'Search is unavailable right now.'
                : query.isLoading
                  ? 'Searching…'
                  : `No results for “${search.trim()}”`}
            </div>
          )}
        >
          {[
            filteredRecents.length > 0 && (
              <MenuSection key="recent">
                <MenuSectionHeader>Recent</MenuSectionHeader>
                {filteredRecents.map((recent) => (
                  <MenuItem
                    key={recent.url}
                    href={docsHref(recent.url)}
                    textValue={recent.title}
                  >
                    <ClockIcon className="text-fg-muted!" />
                    <MenuItemLabel className="truncate">
                      {recent.title}
                    </MenuItemLabel>
                  </MenuItem>
                ))}
              </MenuSection>
            ),
            filteredNav.length > 0 && (
              <MenuSection key="navigation">
                <MenuSectionHeader>Navigation</MenuSectionHeader>
                {filteredNav.map((item) => (
                  <MenuItem
                    key={item.name}
                    // navItems is typed loosely (`to: string`) for the
                    // header's Link props; its values are valid routes.
                    href={{ to: item.to, params: item.params } as ToOptions}
                    textValue={item.name}
                  >
                    <ArrowRightIcon className="text-fg-muted!" />
                    {item.name}
                  </MenuItem>
                ))}
              </MenuSection>
            ),
            ...items.map((group, index) => {
              if (group.type !== 'folder') return null
              const pages = group.children.filter(
                (item): item is PageTree.Item =>
                  item.type === 'page' && matches(item.name as string),
              )
              if (pages.length === 0) return null
              return (
                // oxlint-disable-next-line react/no-array-index-key -- items is static navigation data
                <MenuSection key={`folder-${index}`}>
                  <MenuSectionHeader>{group.name}</MenuSectionHeader>
                  {pages.map((item) => (
                    <MenuItem
                      key={item.url}
                      href={item.url}
                      textValue={item.name as string}
                    >
                      {group.name === 'Components' ? (
                        <CircleDashedIcon className="text-fg-muted!" />
                      ) : (
                        <FileTextIcon className="text-fg-muted!" />
                      )}
                      {item.name}
                    </MenuItem>
                  ))}
                </MenuSection>
              )
            }),
            (matches('Toggle theme') || matches('GitHub')) && (
              <MenuSection key="general">
                <MenuSectionHeader>General</MenuSectionHeader>
                {matches('Toggle theme') && (
                  <MenuItem
                    textValue="Toggle theme"
                    onAction={() => {
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                      onClose()
                    }}
                  >
                    <SunIcon className="block text-fg-muted! dark:hidden" />
                    <MoonIcon className="hidden text-fg-muted! dark:block" />
                    Toggle theme
                  </MenuItem>
                )}
                {matches('GitHub') && (
                  <MenuItem
                    href={siteConfig.links.github}
                    target="_blank"
                    textValue="GitHub"
                  >
                    <GitHubIcon className="text-fg-muted!" />
                    GitHub
                  </MenuItem>
                )}
              </MenuSection>
            ),
            nestedResults.length > 0 && (
              <MenuSection key="search-results">
                <MenuSectionHeader>Search results</MenuSectionHeader>
                {nestedResults.map(({ page, child }) => (
                  <MenuItem
                    key={child.id}
                    href={docsHref(child.url)}
                    textValue={stripMarks(child.content)}
                    onAction={() => rememberChild(page, child)}
                  >
                    {child.type === 'heading' ? (
                      <HashIcon className="text-fg-muted!" />
                    ) : (
                      <TextIcon className="text-fg-muted!" />
                    )}
                    <MenuItemLabel className="truncate">
                      <Highlight text={child.content} />
                    </MenuItemLabel>
                    <span className="ml-auto shrink-0 text-xs text-fg-muted">
                      {stripMarks(page.content)}
                    </span>
                  </MenuItem>
                ))}
              </MenuSection>
            ),
          ]}
        </MenuContent>
      </div>
    </Autocomplete>
  )
}
