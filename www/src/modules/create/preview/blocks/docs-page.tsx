"use client"

import { useEffect, useState } from "react"

import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalculatorIcon,
  CalendarIcon,
  CheckIcon,
  CircleDotIcon,
  CopyIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  InfoIcon,
  LayersIcon,
  PaletteIcon,
  SearchIcon,
  SettingsIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  StarIcon,
  TerminalIcon,
  UserIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Accordion } from "@/registry/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Command } from "@/registry/ui/command"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/registry/ui/sidebar"
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
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const NAV_GROUPS = [
  {
    label: "Getting started",
    items: [
      { id: "introduction", label: "Introduction", icon: BookOpenIcon },
      { id: "installation", label: "Installation", icon: TerminalIcon },
      { id: "theming", label: "Theming", icon: PaletteIcon },
      { id: "layout", label: "Layout & density", icon: LayersIcon },
    ],
  },
  {
    label: "Components",
    items: [
      { id: "breadcrumbs", label: "Breadcrumbs", icon: ShapesIcon },
      { id: "command-menu", label: "Command menu", icon: SparklesIcon },
      { id: "context-menu", label: "Context menu", icon: ShapesIcon },
      { id: "data-table", label: "Data table", icon: ShapesIcon },
      { id: "date-picker", label: "Date picker", icon: CalendarIcon },
    ],
  },
  {
    label: "Guides",
    items: [
      { id: "accessibility", label: "Accessibility", icon: CircleDotIcon },
      { id: "ssr", label: "Server rendering", icon: CircleDotIcon },
      { id: "migrating", label: "Migrating from v1", icon: CircleDotIcon },
    ],
  },
]

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "example", label: "Example" },
  { id: "api-reference", label: "API reference" },
  { id: "keyboard", label: "Keyboard" },
  { id: "faq", label: "FAQ" },
]

const INSTALL_COMMANDS = [
  { id: "npm", label: "npm", command: "npm install @aperture/ui" },
  { id: "pnpm", label: "pnpm", command: "pnpm add @aperture/ui" },
  { id: "yarn", label: "yarn", command: "yarn add @aperture/ui" },
]

const USAGE_CODE = `import { CommandMenu } from "@aperture/ui"

export function AppShell() {
  return (
    <CommandMenu shortcut="mod+k" placeholder="Type a command…">
      <CommandMenu.Group heading="Navigation">
        <CommandMenu.Item onSelect={() => navigate("/inbox")}>
          Go to inbox
        </CommandMenu.Item>
        <CommandMenu.Item onSelect={() => navigate("/billing")}>
          Go to billing
        </CommandMenu.Item>
      </CommandMenu.Group>
    </CommandMenu>
  )
}`

const PROPS = [
  {
    name: "isOpen",
    type: "boolean",
    default: "—",
    description: "Open state, for controlled usage.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "false",
    description: "Open state when uncontrolled.",
  },
  {
    name: "onOpenChange",
    type: "(isOpen: boolean) => void",
    default: "—",
    description: "Called when the open state changes.",
  },
  {
    name: "shortcut",
    type: "string",
    default: '"mod+k"',
    description: "Global shortcut that toggles the menu.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Search…"',
    description: "Placeholder for the search input.",
  },
  {
    name: "filter",
    type: "(value, search) => number",
    default: "defaultFilter",
    description: "Scores and ranks items as you type.",
  },
  {
    name: "shouldLoop",
    type: "boolean",
    default: "true",
    description: "Wrap from the last item to the first.",
  },
]

const SHORTCUTS = [
  { keys: ["⌘", "K"], action: "Open or close the command menu" },
  { keys: ["↑", "↓"], action: "Move between the visible items" },
  { keys: ["↵"], action: "Run the highlighted command" },
  { keys: ["⌘", "⌫"], action: "Clear the current search" },
  { keys: ["Esc"], action: "Dismiss the menu and restore focus" },
]

const FAQ = [
  {
    id: "async",
    question: "Can items be loaded asynchronously?",
    answer:
      "Yes. Pass a promise-returning loader to the group and the menu keeps the previous results visible while the next page resolves, so the list never collapses under the cursor.",
  },
  {
    id: "scoring",
    question: "How is the result ranking decided?",
    answer:
      "Every item is scored by a fuzzy matcher against the search value. Items scoring zero are removed from the collection entirely, which keeps arrow-key navigation aligned with what is on screen.",
  },
  {
    id: "portal",
    question: "Does it work inside a modal or a drawer?",
    answer:
      "It does. The menu renders in the nearest overlay container, inherits its focus scope, and returns focus to the trigger when it closes.",
  },
]

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-heading text-xl font-semibold tracking-tight"
    >
      {children}
    </h2>
  )
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted">
      <div className="absolute top-2 right-2 z-10">
        <Tooltip>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label={copied ? "Code copied" : "Copy code"}
            onPress={() => setCopied(true)}
          >
            {copied ? <CheckIcon className="text-fg-success" /> : <CopyIcon />}
          </Button>
          <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
        </Tooltip>
      </div>
      <pre className="overflow-x-auto p-4 pr-14 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function DocsPage() {
  const [activePage, setActivePage] = useState("command-menu")
  const [activeHeading, setActiveHeading] = useState("overview")

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-bg text-fg">
      <SidebarProvider className="min-h-0 flex-1 overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
                <SparklesIcon className="size-4" />
              </span>
              <span className="font-heading text-sm font-semibold">
                Aperture UI
              </span>
            </div>
            <Select
              aria-label="Documentation version"
              defaultSelectedKey="v2.4"
              className="w-full"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="v2.4">v2.4 · latest</SelectItem>
                <SelectItem id="v2.3">v2.3</SelectItem>
                <SelectItem id="v1.9">v1.9 · legacy</SelectItem>
              </SelectContent>
            </Select>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            {NAV_GROUPS.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activePage === item.id}
                          onPress={() => setActivePage(item.id)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm font-medium">Aperture Cloud</p>
              <p className="mt-1 text-xs text-fg-muted">
                Hosted previews and design tokens for your whole team.
              </p>
              <Button variant="primary" size="sm" className="mt-3 w-full">
                Start free trial
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0 overflow-y-auto">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-bg/85 px-4 backdrop-blur sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <span className="truncate text-sm font-medium max-sm:hidden lg:hidden">
              Command menu
            </span>
            <Breadcrumbs className="min-w-0 max-lg:hidden">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>Command menu</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumbs>
            <div className="ml-auto flex items-center gap-2">
              <SearchField
                aria-label="Search documentation"
                className="w-40 sm:w-64"
              >
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <Input placeholder="Search docs…" />
                  <InputGroupAddon className="max-sm:hidden">
                    <Kbd>⌘K</Kbd>
                  </InputGroupAddon>
                </InputGroup>
              </SearchField>
              <Button
                variant="secondary"
                size="sm"
                className="max-md:hidden"
                aria-label="Star Aperture UI on the repository"
              >
                <StarIcon />
                <span>4,182</span>
              </Button>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8 xl:gap-10">
            <article className="flex min-w-0 flex-1 flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success" appearance="subtle" size="lg">
                    Stable
                  </Badge>
                  <Badge variant="neutral" appearance="subtle" size="lg">
                    Added in v2.1
                  </Badge>
                  <span className="text-xs text-fg-muted">
                    Updated 12 August 2026 by Naomi Ferrer
                  </span>
                </div>
                <h1
                  id="overview"
                  className="scroll-mt-24 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
                >
                  Command menu
                </h1>
                <p className="max-w-prose text-pretty text-fg-muted">
                  A searchable overlay that puts every action in the product one
                  keystroke away. It filters as you type, groups results by
                  intent, and runs the highlighted command without ever leaving
                  the keyboard.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                    <ExternalLinkIcon />
                    View source
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ExternalLinkIcon />
                    Report an issue
                  </Button>
                </div>
              </div>

              <Alert variant="info">
                <InfoIcon />
                <AlertTitle>The menu owns its shortcut</AlertTitle>
                <AlertDescription>
                  Mounting the component registers a global listener for{" "}
                  <code className="font-mono">mod+k</code>. Render it once, near
                  the root of the app, and open it from anywhere with the{" "}
                  <code className="font-mono">useCommand</code> hook.
                </AlertDescription>
              </Alert>

              <section className="flex flex-col gap-4">
                <SectionHeading id="installation">Installation</SectionHeading>
                <p className="max-w-prose text-pretty text-fg-muted">
                  The command menu ships in the core package alongside its
                  filtering engine. No extra peer dependency is required.
                </p>
                <Tabs>
                  <TabList variant="line" aria-label="Package manager">
                    {INSTALL_COMMANDS.map((entry) => (
                      <Tab key={entry.id} id={entry.id}>
                        {entry.label}
                      </Tab>
                    ))}
                  </TabList>
                  {INSTALL_COMMANDS.map((entry) => (
                    <TabPanel key={entry.id} id={entry.id}>
                      <CodeBlock code={entry.command} />
                    </TabPanel>
                  ))}
                </Tabs>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading id="usage">Usage</SectionHeading>
                <p className="max-w-prose text-pretty text-fg-muted">
                  Compose the menu from groups and items. Each item declares
                  what it does through{" "}
                  <code className="font-mono">onSelect</code>; the menu handles
                  filtering, ranking, and focus for you.
                </p>
                <CodeBlock code={USAGE_CODE} />
                <Alert variant="warning">
                  <AlertTriangleIcon />
                  <AlertTitle>Keep item labels stable</AlertTitle>
                  <AlertDescription>
                    Labels are the key the filter scores against. Rebuilding
                    them on every render resets the highlighted row mid-search
                    and makes the list feel like it is fighting the cursor.
                  </AlertDescription>
                </Alert>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading id="example">Example</SectionHeading>
                <p className="max-w-prose text-pretty text-fg-muted">
                  A menu with two groups and per-item shortcuts. Type to filter,
                  then use the arrow keys to walk the results.
                </p>
                <div className="rounded-lg border bg-muted p-4 sm:p-8">
                  <div className="mx-auto max-w-md">
                    <Card className="w-full p-0">
                      <Command aria-label="Command menu">
                        <SearchField aria-label="Search commands">
                          <InputGroup>
                            <InputGroupAddon>
                              <SearchIcon />
                            </InputGroupAddon>
                            <Input placeholder="Type a command or search…" />
                            <InputGroupAddon className="[--addon-button-inset:--spacing(2)]">
                              <Button isIconOnly variant="quiet">
                                <XIcon aria-hidden="true" />
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </SearchField>
                        <ListBox aria-label="Commands">
                          <ListBoxSection>
                            <ListBoxSectionHeader>
                              Suggestions
                            </ListBoxSectionHeader>
                            <ListBoxItem textValue="Open calendar">
                              <CalendarIcon />
                              <span>Open calendar</span>
                            </ListBoxItem>
                            <ListBoxItem textValue="Insert emoji">
                              <SmileIcon />
                              <span>Insert emoji</span>
                            </ListBoxItem>
                            <ListBoxItem textValue="Run calculator">
                              <CalculatorIcon />
                              <span>Run calculator</span>
                            </ListBoxItem>
                          </ListBoxSection>
                          <Separator />
                          <ListBoxSection>
                            <ListBoxSectionHeader>Account</ListBoxSectionHeader>
                            <ListBoxItem textValue="Profile">
                              <UserIcon />
                              <span>Profile</span>
                              <Kbd>⌘P</Kbd>
                            </ListBoxItem>
                            <ListBoxItem textValue="Billing">
                              <CreditCardIcon />
                              <span>Billing</span>
                              <Kbd>⌘B</Kbd>
                            </ListBoxItem>
                            <ListBoxItem textValue="Workspace settings">
                              <SettingsIcon />
                              <span>Workspace settings</span>
                              <Kbd>⌘S</Kbd>
                            </ListBoxItem>
                          </ListBoxSection>
                        </ListBox>
                      </Command>
                    </Card>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading id="api-reference">
                  API reference
                </SectionHeading>
                <p className="max-w-prose text-pretty text-fg-muted">
                  Props accepted by{" "}
                  <code className="font-mono">CommandMenu</code>. Every unlisted
                  DOM prop is forwarded to the overlay element.
                </p>
                <TableContainer>
                  <Table aria-label="CommandMenu props">
                    <TableHeader>
                      <TableColumn isRowHeader>Prop</TableColumn>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Default</TableColumn>
                      <TableColumn>Description</TableColumn>
                    </TableHeader>
                    <TableBody items={PROPS}>
                      {(prop) => (
                        <TableRow id={prop.name}>
                          <TableCell className="font-mono text-xs whitespace-nowrap">
                            {prop.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap text-fg-muted">
                            {prop.type}
                          </TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap text-fg-muted">
                            {prop.default}
                          </TableCell>
                          <TableCell className="min-w-56 text-fg-muted">
                            {prop.description}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading id="keyboard">Keyboard</SectionHeading>
                <ul className="flex flex-col gap-2">
                  {SHORTCUTS.map((shortcut) => (
                    <li
                      key={shortcut.action}
                      className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-2.5"
                    >
                      <span className="text-sm text-fg-muted">
                        {shortcut.action}
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        {shortcut.keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading id="faq">FAQ</SectionHeading>
                <Accordion
                  allowsMultipleExpanded
                  defaultExpandedKeys={["async"]}
                >
                  {FAQ.map((entry) => (
                    <Disclosure key={entry.id} id={entry.id}>
                      <DisclosureTrigger>{entry.question}</DisclosureTrigger>
                      <DisclosurePanel>{entry.answer}</DisclosurePanel>
                    </Disclosure>
                  ))}
                </Accordion>
              </section>

              <Separator />

              <nav
                aria-label="Pagination"
                className="grid gap-3 sm:grid-cols-2"
              >
                <a
                  href="#overview"
                  className="rounded-(--card-radius) focus-reset focus-visible:focus-ring"
                >
                  <Card className="h-full transition-colors hover:bg-muted">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-1.5">
                        <ArrowLeftIcon className="size-3.5" />
                        Previous
                      </CardDescription>
                      <CardTitle>Breadcrumbs</CardTitle>
                      <CardDescription>
                        Show where a page sits in the hierarchy.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </a>
                <a
                  href="#overview"
                  className="rounded-(--card-radius) focus-reset focus-visible:focus-ring"
                >
                  <Card className="h-full transition-colors hover:bg-muted sm:text-right">
                    <CardHeader>
                      <CardDescription className="flex items-center gap-1.5 sm:justify-end">
                        Next
                        <ArrowRightIcon className="size-3.5" />
                      </CardDescription>
                      <CardTitle>Context menu</CardTitle>
                      <CardDescription>
                        Right-click actions scoped to a single row or canvas.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              </nav>
            </article>

            <aside className="hidden w-52 shrink-0 lg:block xl:w-56">
              <div className="sticky top-22 flex flex-col gap-3">
                <span className="text-xs font-medium tracking-wide text-fg-muted">
                  On this page
                </span>
                <ul className="flex flex-col gap-0.5 border-l">
                  {TOC.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        onClick={() => setActiveHeading(entry.id)}
                        className={cn(
                          "-ml-px block border-l border-transparent py-1 pl-3 text-sm text-fg-muted transition-colors hover:text-fg",
                          activeHeading === entry.id &&
                            "border-primary font-medium text-fg",
                        )}
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <Separator />
                <Button variant="quiet" size="sm" className="justify-start">
                  <ExternalLinkIcon />
                  Edit this page
                </Button>
              </div>
            </aside>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
