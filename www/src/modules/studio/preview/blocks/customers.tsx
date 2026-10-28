import { useMemo, useState } from "react"
import type { ReactNode } from "react"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  DownloadIcon,
  FileTextIcon,
  ListFilterIcon,
  MailIcon,
  MapIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  SmartphoneIcon,
  StarIcon,
  TagIcon,
  UploadIcon,
  UserIcon,
  Users2Icon,
  XIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { initials } from "./shared"

// An Attio-style CRM: a dense People table with typed attributes (company
// chips, connection strength, categories), saved views, sort and filter, and
// a record that opens in a side panel with its attributes and activity.

type Strength = "very-strong" | "strong" | "good" | "weak"

interface Person {
  id: string
  name: string
  email: string
  company: string
  title: string
  strength: Strength
  lastInteraction: number // days ago
  location: string
  categories: string[]
}

const STRENGTH: Record<
  Strength,
  {
    label: string
    variant: "success" | "info" | "neutral" | "warning"
    rank: number
  }
> = {
  "very-strong": { label: "Very strong", variant: "success", rank: 4 },
  strong: { label: "Strong", variant: "info", rank: 3 },
  good: { label: "Good", variant: "neutral", rank: 2 },
  weak: { label: "Weak", variant: "warning", rank: 1 },
}

const PEOPLE: Person[] = [
  {
    id: "p1",
    name: "Amara Okafor",
    email: "amara@lumenpay.com",
    company: "LumenPay",
    title: "Head of Growth",
    strength: "very-strong",
    lastInteraction: 0,
    location: "Lagos",
    categories: ["Customer"],
  },
  {
    id: "p2",
    name: "Tobias Lindqvist",
    email: "tobias@fjordlabs.se",
    company: "Fjord Labs",
    title: "CTO",
    strength: "strong",
    lastInteraction: 1,
    location: "Stockholm",
    categories: ["Prospect"],
  },
  {
    id: "p3",
    name: "Mei Chen",
    email: "mei@harborvc.com",
    company: "Harbor Ventures",
    title: "Partner",
    strength: "very-strong",
    lastInteraction: 2,
    location: "San Francisco",
    categories: ["Investor"],
  },
  {
    id: "p4",
    name: "Rafael Duarte",
    email: "rafael@tidal.io",
    company: "Tidal",
    title: "VP Engineering",
    strength: "good",
    lastInteraction: 3,
    location: "Lisbon",
    categories: ["Customer", "Partner"],
  },
  {
    id: "p5",
    name: "Nadia Petrova",
    email: "nadia@orbit.dev",
    company: "Orbit",
    title: "Founder & CEO",
    strength: "strong",
    lastInteraction: 4,
    location: "Berlin",
    categories: ["Prospect"],
  },
  {
    id: "p6",
    name: "Julian Marsh",
    email: "julian@northwind.co",
    company: "Northwind",
    title: "Procurement Lead",
    strength: "weak",
    lastInteraction: 12,
    location: "London",
    categories: ["Customer"],
  },
  {
    id: "p7",
    name: "Sofia Rinaldi",
    email: "sofia@vela.ai",
    company: "Vela AI",
    title: "Product Manager",
    strength: "good",
    lastInteraction: 6,
    location: "Milan",
    categories: ["Prospect"],
  },
  {
    id: "p8",
    name: "Kwame Mensah",
    email: "kwame@sankofa.capital",
    company: "Sankofa Capital",
    title: "Principal",
    strength: "strong",
    lastInteraction: 8,
    location: "Accra",
    categories: ["Investor"],
  },
  {
    id: "p9",
    name: "Hana Sato",
    email: "hana@kumo.jp",
    company: "Kumo",
    title: "Design Director",
    strength: "very-strong",
    lastInteraction: 1,
    location: "Tokyo",
    categories: ["Customer"],
  },
  {
    id: "p10",
    name: "Diego Alvarez",
    email: "diego@ruta.mx",
    company: "Ruta",
    title: "COO",
    strength: "weak",
    lastInteraction: 21,
    location: "Mexico City",
    categories: ["Prospect"],
  },
  {
    id: "p11",
    name: "Ingrid Holm",
    email: "ingrid@polar.no",
    company: "Polar",
    title: "Head of Data",
    strength: "good",
    lastInteraction: 9,
    location: "Oslo",
    categories: ["Customer"],
  },
  {
    id: "p12",
    name: "Omar Haddad",
    email: "omar@cedarworks.com",
    company: "Cedarworks",
    title: "CFO",
    strength: "strong",
    lastInteraction: 5,
    location: "Dubai",
    categories: ["Partner"],
  },
  {
    id: "p13",
    name: "Lucía Romero",
    email: "lucia@brisa.es",
    company: "Brisa",
    title: "Engineering Manager",
    strength: "good",
    lastInteraction: 14,
    location: "Madrid",
    categories: ["Customer"],
  },
  {
    id: "p14",
    name: "Ethan Brooks",
    email: "ethan@summit.vc",
    company: "Summit",
    title: "General Partner",
    strength: "very-strong",
    lastInteraction: 0,
    location: "New York",
    categories: ["Investor"],
  },
]

const VIEWS = [
  { id: "all", label: "All People", filter: () => true },
  {
    id: "customers",
    label: "Customers",
    filter: (p: Person) => p.categories.includes("Customer"),
  },
  {
    id: "investors",
    label: "Investors",
    filter: (p: Person) => p.categories.includes("Investor"),
  },
  {
    id: "cold",
    label: "Going cold",
    filter: (p: Person) => p.lastInteraction > 7,
  },
]

const ACTIVITY = [
  {
    icon: MailIcon,
    text: "Email: Re: Q4 renewal terms",
    when: "Today, 9:14 AM",
  },
  {
    icon: CalendarIcon,
    text: "Meeting: Pricing review (45 min)",
    when: "Yesterday",
  },
  {
    icon: MessageSquareIcon,
    text: "Note added by Maya Okonkwo",
    when: "Oct 24",
  },
  {
    icon: CheckCircle2Icon,
    text: "Task completed: Send security pack",
    when: "Oct 22",
  },
]

function lastInteractionLabel(days: number) {
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  const weeks = Math.round(days / 7)
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
}

function CompanyChip({ name }: { name: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="flex size-4 shrink-0 items-center justify-center rounded-(--studio-radius-detail) bg-muted text-[0.5625rem] font-semibold text-fg-muted">
        {name[0]}
      </span>
      <span className="truncate">{name}</span>
    </span>
  )
}

function Attribute({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MailIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-8 items-center gap-3 text-sm compact:text-xs">
      <span className="flex w-32 shrink-0 items-center gap-2 text-fg-muted">
        <Icon className="size-3.5" />
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {children}
      </div>
    </div>
  )
}

function RecordPanel({
  person,
  onClose,
}: {
  person: Person
  onClose: () => void
}) {
  return (
    <aside
      aria-label={person.name}
      className="flex min-h-0 w-full shrink-0 flex-col border-l bg-bg max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-10 max-lg:max-w-md lg:w-[26rem]"
    >
      <div className="flex h-12 shrink-0 items-center gap-1 border-b px-4">
        <span className="text-sm text-fg-muted compact:text-xs">People</span>
        <div className="ml-auto flex items-center gap-0.5">
          <Button variant="quiet" size="sm" isIconOnly aria-label="Favorite">
            <StarIcon />
          </Button>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Close record"
            onPress={onClose}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 px-5 pt-5">
          <Avatar size="lg">
            <AvatarFallback>{initials(person.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-heading text-lg font-medium">
              {person.name}
            </span>
            <span className="truncate text-sm text-fg-muted compact:text-xs">
              {person.title} at {person.company}
            </span>
          </div>
        </div>
        <div className="flex gap-2 px-5 pt-4">
          <Button variant="secondary" size="sm">
            <MailIcon />
            Compose email
          </Button>
          <Button variant="secondary" size="sm">
            <CalendarIcon />
            Schedule
          </Button>
        </div>
        <Tabs className="mt-4">
          <TabList aria-label="Record" variant="line" className="px-5">
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
            <Tab id="notes">Notes</Tab>
          </TabList>
          <TabPanel id="overview" className="flex flex-col px-5 py-3">
            <Attribute icon={MailIcon} label="Email">
              <span className="truncate">{person.email}</span>
            </Attribute>
            <Attribute icon={Building2Icon} label="Company">
              <CompanyChip name={person.company} />
            </Attribute>
            <Attribute icon={UserIcon} label="Job title">
              {person.title}
            </Attribute>
            <Attribute icon={MapIcon} label="Location">
              {person.location}
            </Attribute>
            <Attribute icon={ZapIcon} label="Connection">
              <Badge size="sm" variant={STRENGTH[person.strength].variant}>
                {STRENGTH[person.strength].label}
              </Badge>
            </Attribute>
            <Attribute icon={TagIcon} label="Categories">
              {person.categories.map((category) => (
                <Badge key={category} size="sm" variant="neutral">
                  {category}
                </Badge>
              ))}
            </Attribute>
            <Attribute icon={SmartphoneIcon} label="Phone">
              <span className="text-fg-muted">Add phone</span>
            </Attribute>
          </TabPanel>
          <TabPanel id="activity" className="px-5 py-3">
            <ol className="flex flex-col gap-4">
              {ACTIVITY.map((event) => (
                <li key={event.text} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-(--studio-radius-pill) border text-fg-muted">
                    <event.icon className="size-3.5" />
                  </span>
                  <div className="flex flex-col text-sm compact:text-xs">
                    <span>{event.text}</span>
                    <span className="text-xs text-fg-muted">{event.when}</span>
                  </div>
                </li>
              ))}
            </ol>
          </TabPanel>
          <TabPanel id="notes" className="px-5 py-3">
            <p className="text-sm text-pretty compact:text-xs">
              Wants usage-based pricing for the analytics add-on. Decision by
              end of quarter; procurement needs the security pack first.
            </p>
            <p className="mt-2 text-xs text-fg-muted">Maya Okonkwo · Oct 24</p>
          </TabPanel>
        </Tabs>
      </div>
    </aside>
  )
}

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sable">
              <BrandMark className="size-5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-(--studio-radius-detail) bg-primary text-[0.625rem] font-semibold text-fg-on-primary">
                  S
                </span>
              </BrandMark>
              <span className="truncate font-medium">
                <BrandName>Sable</BrandName>
              </span>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Quick actions">
              <SearchIcon />
              <span>Quick actions</span>
              <Kbd className="ml-auto group-data-[collapsible=icon]:hidden">
                ⌘K
              </Kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications">
              <BellIcon />
              <span>Notifications</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>3</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Tasks">
              <CheckCircle2Icon />
              <span>Tasks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notes">
              <FileTextIcon />
              <span>Notes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { icon: Building2Icon, label: "Companies" },
              { icon: Users2Icon, label: "People", active: true },
              { icon: ZapIcon, label: "Deals" },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label} isActive={item.active}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Lists</SidebarGroupLabel>
          <SidebarMenu>
            {["Enterprise pipeline", "Seed investors", "Design partners"].map(
              (list) => (
                <SidebarMenuItem key={list}>
                  <SidebarMenuButton>
                    <span className="flex size-4 items-center justify-center text-fg-muted">
                      #
                    </span>
                    <span>{list}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

type SortKey = "name" | "strength" | "lastInteraction"

export default function CustomersBlock() {
  const [view, setView] = useState("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({
    key: "lastInteraction",
    descending: false,
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(null)

  const rows = useMemo(() => {
    const filter = VIEWS.find((v) => v.id === view)?.filter ?? (() => true)
    const q = query.trim().toLowerCase()
    const value = (p: Person) =>
      sort.key === "name"
        ? p.name
        : sort.key === "strength"
          ? STRENGTH[p.strength].rank
          : p.lastInteraction
    return PEOPLE.filter(
      (p) =>
        filter(p) &&
        (!q || `${p.name} ${p.company} ${p.email}`.toLowerCase().includes(q)),
    ).sort((a, b) => {
      const first = value(a)
      const second = value(b)
      const cmp =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second))
      return sort.descending ? -cmp : cmp
    })
  }, [view, query, sort])

  const open = PEOPLE.find((p) => p.id === openId)
  const viewLabel = VIEWS.find((v) => v.id === view)?.label
  const sortLabel = {
    name: "Name",
    strength: "Connection strength",
    lastInteraction: "Last interaction",
  }[sort.key]

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SidebarProvider className="h-svh min-h-svh">
        <AppSidebar />
        <SidebarInset className="relative flex h-svh min-h-0 flex-row overflow-hidden">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
              <SidebarTrigger />
              <Users2Icon className="size-4 text-fg-muted" />
              <h1 className="text-sm font-medium compact:text-xs">People</h1>
              <div className="ml-auto flex items-center gap-1.5">
                <Menu>
                  <Button variant="quiet" size="sm">
                    Import / Export
                    <ChevronDownIcon />
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent className="min-w-48">
                      <MenuItem>
                        <UploadIcon />
                        Import CSV
                      </MenuItem>
                      <MenuItem>
                        <DownloadIcon />
                        Export view
                      </MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
                <Button variant="primary" size="sm">
                  <PlusIcon />
                  New person
                </Button>
              </div>
            </header>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-2">
              <Menu>
                <Button variant="secondary" size="sm">
                  {viewLabel}
                  <ChevronDownIcon />
                </Button>
                <Popover placement="bottom start">
                  <MenuContent
                    className="min-w-52"
                    selectionMode="single"
                    selectedKeys={[view]}
                    onAction={(key) => setView(String(key))}
                  >
                    <MenuSection>
                      <MenuSectionHeader>Views</MenuSectionHeader>
                      {VIEWS.map((v) => (
                        <MenuItem key={v.id} id={v.id}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </MenuSection>
                  </MenuContent>
                </Popover>
              </Menu>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Menu>
                <Button variant="quiet" size="sm">
                  {sort.descending ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  Sorted by {sortLabel}
                </Button>
                <Popover placement="bottom start">
                  <MenuContent
                    className="min-w-56"
                    selectionMode="single"
                    selectedKeys={[sort.key]}
                    onAction={(key) =>
                      setSort((current) => ({
                        key: key as SortKey,
                        descending:
                          current.key === key ? !current.descending : false,
                      }))
                    }
                  >
                    <MenuItem id="name">Name</MenuItem>
                    <MenuItem id="strength">Connection strength</MenuItem>
                    <MenuItem id="lastInteraction">Last interaction</MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
              <Button variant="quiet" size="sm">
                <ListFilterIcon />
                Filter
              </Button>
              <div className="ml-auto flex items-center gap-1.5">
                <SearchField
                  aria-label="Search people"
                  placeholder="Search"
                  value={query}
                  onChange={setQuery}
                  className="w-44"
                />
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="View settings"
                >
                  <Settings2Icon />
                </Button>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="flex shrink-0 items-center gap-2 border-b bg-muted px-4 py-1.5 text-sm compact:text-xs">
                <span className="font-medium tabular-nums">
                  {selected.size} selected
                </span>
                <Button variant="quiet" size="sm">
                  <TagIcon />
                  Add to list
                </Button>
                <Button variant="quiet" size="sm">
                  <MailIcon />
                  Send sequence
                </Button>
                <Button
                  variant="quiet"
                  size="sm"
                  className="ml-auto"
                  onPress={() => setSelected(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-auto">
              <TableContainer className="rounded-none border-0">
                <Table
                  aria-label="People"
                  selectionMode="multiple"
                  selectedKeys={selected}
                  onSelectionChange={(keys) =>
                    setSelected(
                      keys === "all"
                        ? new Set(rows.map((row) => row.id))
                        : new Set(Array.from(keys, String)),
                    )
                  }
                  onRowAction={(key) => setOpenId(String(key))}
                  className="min-w-[60rem]"
                >
                  <TableHeader>
                    <TableColumn isRowHeader className="w-56">
                      Person
                    </TableColumn>
                    <TableColumn className="w-44">Company</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn className="w-36">Connection</TableColumn>
                    <TableColumn className="w-36">Last interaction</TableColumn>
                    <TableColumn className="w-40">Categories</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={rows}
                    dependencies={[openId]}
                    renderEmptyState={() => (
                      <div className="py-10 text-center text-sm text-fg-muted compact:text-xs">
                        No people match this view.
                      </div>
                    )}
                  >
                    {(person) => (
                      <TableRow
                        id={person.id}
                        textValue={person.name}
                        className={cn(person.id === openId && "bg-muted")}
                      >
                        <TableCell>
                          <span className="flex min-w-0 items-center gap-2">
                            <Avatar size="sm" className="size-6">
                              <AvatarFallback className="text-[0.625rem]">
                                {initials(person.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium">
                              {person.name}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <CompanyChip name={person.company} />
                        </TableCell>
                        <TableCell className="truncate text-fg-muted">
                          {person.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            size="sm"
                            variant={STRENGTH[person.strength].variant}
                          >
                            {STRENGTH[person.strength].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-fg-muted">
                          {lastInteractionLabel(person.lastInteraction)}
                        </TableCell>
                        <TableCell>
                          <span className="flex gap-1">
                            {person.categories.map((category) => (
                              <Badge key={category} size="sm" variant="neutral">
                                {category}
                              </Badge>
                            ))}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex h-10 items-center border-b px-4 text-sm text-fg-muted compact:text-xs">
                <Button
                  variant="quiet"
                  size="sm"
                  className="-ml-2 text-fg-muted"
                >
                  <PlusIcon />
                  Add person
                </Button>
                <span className="ml-auto tabular-nums">
                  {rows.length} of {PEOPLE.length} people
                </span>
              </div>
            </div>
          </main>

          {open && (
            <RecordPanel
              key={open.id}
              person={open}
              onClose={() => setOpenId(null)}
            />
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
