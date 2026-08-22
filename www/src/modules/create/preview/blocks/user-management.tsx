"use client"

import * as React from "react"

import {
  ActivityIcon,
  DownloadIcon,
  EyeIcon,
  MailCheckIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundXIcon,
  Users2Icon,
} from "@/registry/icons"
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
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Description, Label } from "@/registry/ui/field"
import { TextArea } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type Role = "owner" | "admin" | "developer" | "billing" | "viewer"
type Status = "active" | "invited" | "suspended"

interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  team: string
  lastActive: string
}

const ROLES: { id: Role; label: string }[] = [
  { id: "owner", label: "Owner" },
  { id: "admin", label: "Admin" },
  { id: "developer", label: "Developer" },
  { id: "billing", label: "Billing" },
  { id: "viewer", label: "Viewer" },
]

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  billing: "Billing",
  viewer: "Viewer",
}

const STATUS_LABEL: Record<Status, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
}

const STATUS_VARIANT = {
  active: "success",
  invited: "warning",
  suspended: "danger",
} as const

const MEMBERS: Member[] = [
  {
    id: "amara-osei",
    name: "Amara Osei",
    email: "amara.osei@northwind.dev",
    role: "owner",
    status: "active",
    team: "Platform",
    lastActive: "2 minutes ago",
  },
  {
    id: "liam-osullivan",
    name: "Liam O'Sullivan",
    email: "liam@northwind.dev",
    role: "developer",
    status: "active",
    team: "Support",
    lastActive: "9 minutes ago",
  },
  {
    id: "tomas-ferreira",
    name: "Tomás Ferreira",
    email: "tomas@northwind.dev",
    role: "admin",
    status: "active",
    team: "Platform",
    lastActive: "18 minutes ago",
  },
  {
    id: "claire-dubois",
    name: "Claire Dubois",
    email: "claire@northwind.dev",
    role: "admin",
    status: "active",
    team: "Design",
    lastActive: "35 minutes ago",
  },
  {
    id: "priya-raghavan",
    name: "Priya Raghavan",
    email: "priya.r@northwind.dev",
    role: "developer",
    status: "active",
    team: "Payments",
    lastActive: "1 hour ago",
  },
  {
    id: "jonas-lindqvist",
    name: "Jonas Lindqvist",
    email: "jonas@northwind.dev",
    role: "developer",
    status: "active",
    team: "Payments",
    lastActive: "3 hours ago",
  },
  {
    id: "rohan-malhotra",
    name: "Rohan Malhotra",
    email: "rohan@northwind.dev",
    role: "developer",
    status: "active",
    team: "Data",
    lastActive: "4 hours ago",
  },
  {
    id: "kenji-watanabe",
    name: "Kenji Watanabe",
    email: "kenji.w@northwind.dev",
    role: "developer",
    status: "active",
    team: "Mobile",
    lastActive: "6 hours ago",
  },
  {
    id: "mei-lin-chen",
    name: "Mei-Lin Chen",
    email: "meilin.chen@northwind.dev",
    role: "admin",
    status: "active",
    team: "Data",
    lastActive: "Yesterday",
  },
  {
    id: "daniel-okafor",
    name: "Daniel Okafor",
    email: "daniel.okafor@northwind.dev",
    role: "billing",
    status: "active",
    team: "Finance",
    lastActive: "Yesterday",
  },
  {
    id: "noah-ellingsen",
    name: "Noah Ellingsen",
    email: "noah@northwind.dev",
    role: "developer",
    status: "active",
    team: "Mobile",
    lastActive: "Yesterday",
  },
  {
    id: "yusuf-demir",
    name: "Yusuf Demir",
    email: "yusuf.demir@northwind.dev",
    role: "developer",
    status: "active",
    team: "Infrastructure",
    lastActive: "2 days ago",
  },
  {
    id: "elena-petrova",
    name: "Elena Petrova",
    email: "elena.petrova@northwind.dev",
    role: "viewer",
    status: "active",
    team: "Design",
    lastActive: "3 days ago",
  },
  {
    id: "sofia-marchetti",
    name: "Sofia Marchetti",
    email: "sofia@northwind.dev",
    role: "viewer",
    status: "invited",
    team: "Design",
    lastActive: "Invite sent Aug 14",
  },
  {
    id: "marcus-bell",
    name: "Marcus Bell",
    email: "marcus.bell@northwind.dev",
    role: "developer",
    status: "invited",
    team: "Platform",
    lastActive: "Invite sent Aug 18",
  },
  {
    id: "isabel-cardoso",
    name: "Isabel Cardoso",
    email: "isabel@northwind.dev",
    role: "billing",
    status: "invited",
    team: "Finance",
    lastActive: "Invite sent Aug 20",
  },
  {
    id: "hannah-weiss",
    name: "Hannah Weiss",
    email: "hannah.weiss@northwind.dev",
    role: "developer",
    status: "suspended",
    team: "Infrastructure",
    lastActive: "12 days ago",
  },
  {
    id: "fatima-zahra",
    name: "Fatima Zahra",
    email: "fatima.zahra@northwind.dev",
    role: "viewer",
    status: "suspended",
    team: "Support",
    lastActive: "1 month ago",
  },
]

const SEAT_LIMIT = 25
const PAGE_SIZE = 6

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")

/** A 5-page window that stays inside the page count and around the current page. */
function pageWindow(page: number, count: number) {
  const size = Math.min(5, count)
  const start = Math.min(Math.max(1, page - 2), Math.max(1, count - size + 1))
  return Array.from({ length: size }, (_, index) => start + index)
}

function InviteDialog() {
  return (
    <Dialog>
      <Button variant="primary">
        <PlusIcon />
        Invite people
      </Button>
      <Modal className="w-full max-w-md">
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Invite people</DialogTitle>
            <DialogDescription>
              Invitations expire after 14 days. New members join the workspace
              as soon as they accept.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="gap-4 py-1">
            <TextField isRequired>
              <Label>Email addresses</Label>
              <TextArea
                rows={2}
                placeholder="maya@northwind.dev, sam@northwind.dev"
              />
              <Description>
                Separate multiple addresses with a comma.
              </Description>
            </TextField>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select defaultValue="developer" className="flex-1">
                <Label>Role</Label>
                <SelectTrigger />
                <SelectContent>
                  {ROLES.filter((role) => role.id !== "owner").map((role) => (
                    <SelectItem key={role.id} id={role.id}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="platform" className="flex-1">
                <Label>Team</Label>
                <SelectTrigger />
                <SelectContent>
                  <SelectItem id="platform">Platform</SelectItem>
                  <SelectItem id="payments">Payments</SelectItem>
                  <SelectItem id="data">Data</SelectItem>
                  <SelectItem id="design">Design</SelectItem>
                  <SelectItem id="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TextField>
              <Label>Message</Label>
              <TextArea
                rows={3}
                placeholder="Welcome aboard — here's access to the billing dashboards you asked about."
              />
            </TextField>
            <Checkbox defaultSelected>
              <CheckboxControl />
              <Label>Email me when the invitation is accepted</Label>
            </Checkbox>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              <MailIcon />
              Send invitations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
}: {
  label: string
  value: string
  caption: string
  icon: typeof Users2Icon
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-fg-muted">{label}</CardTitle>
        <CardAction>
          <Icon className="size-4 text-fg-muted" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-xs text-fg-muted">{caption}</span>
      </CardContent>
    </Card>
  )
}

function RowActions({ member }: { member: Member }) {
  return (
    <Menu>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Actions for ${member.name}`}
      >
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom end">
        <MenuContent className="min-w-48">
          <MenuItem>
            <EyeIcon />
            View profile
          </MenuItem>
          <MenuItem>
            <PencilIcon />
            Edit permissions
          </MenuItem>
          {member.status === "invited" ? (
            <MenuItem>
              <MailCheckIcon />
              Resend invitation
            </MenuItem>
          ) : (
            <MenuItem>
              <ActivityIcon />
              View access log
            </MenuItem>
          )}
          <Separator />
          <MenuItem isDisabled={member.role === "owner"}>
            <UserRoundXIcon />
            Suspend access
          </MenuItem>
          <MenuItem variant="danger" isDisabled={member.role === "owner"}>
            <Trash2Icon />
            Remove from workspace
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

export default function UserManagement() {
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())

  const counts = React.useMemo(
    () => ({
      all: MEMBERS.length,
      active: MEMBERS.filter((m) => m.status === "active").length,
      invited: MEMBERS.filter((m) => m.status === "invited").length,
      suspended: MEMBERS.filter((m) => m.status === "suspended").length,
      admins: MEMBERS.filter((m) => m.role === "owner" || m.role === "admin")
        .length,
    }),
    [],
  )

  const filtered = React.useMemo(() => {
    const search = query.trim().toLowerCase()
    return MEMBERS.filter((member) => {
      if (role !== "all" && member.role !== role) return false
      if (status !== "all" && member.status !== status) return false
      if (!search) return true
      return (
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.team.toLowerCase().includes(search)
      )
    })
  }, [query, role, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const firstRow = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastRow = Math.min(currentPage * PAGE_SIZE, filtered.length)
  const isFiltered = query !== "" || role !== "all" || status !== "all"

  const resetFilters = () => {
    setQuery("")
    setRole("all")
    setStatus("all")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex flex-col gap-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Northwind Labs</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Members</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Members
              </h1>
              <p className="max-w-prose text-sm text-pretty text-fg-muted">
                Manage who can reach the workspace, what each person is allowed
                to do, and which team they belong to.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <Button variant="quiet" isIconOnly aria-label="Export members">
                  <DownloadIcon />
                </Button>
                <TooltipContent>Export as CSV</TooltipContent>
              </Tooltip>
              <InviteDialog />
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Members"
            value={String(counts.all)}
            caption="+3 in the last 30 days"
            icon={Users2Icon}
          />
          <StatCard
            label="Pending invites"
            value={String(counts.invited)}
            caption="Oldest sent 8 days ago"
            icon={MailIcon}
          />
          <StatCard
            label="Admins"
            value={String(counts.admins)}
            caption="1 owner, 3 admins"
            icon={ShieldCheckIcon}
          />
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-fg-muted">Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar
                value={counts.all}
                maxValue={SEAT_LIMIT}
                className="w-full gap-1.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight tabular-nums">
                    {counts.all}
                    <span className="text-sm font-normal text-fg-muted">
                      /{SEAT_LIMIT}
                    </span>
                  </span>
                  <ProgressBarOutput className="text-xs text-fg-muted" />
                </div>
                <ProgressBarControl />
              </ProgressBar>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <SearchField
                aria-label="Search members"
                placeholder="Search name, email or team…"
                value={query}
                onChange={(value) => {
                  setQuery(value)
                  setPage(1)
                }}
                className="w-full sm:w-72"
              />
              <Select
                aria-label="Filter by role"
                value={role}
                onChange={(key) => {
                  setRole(String(key))
                  setPage(1)
                }}
                className="w-full sm:w-40"
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem id="all">All roles</SelectItem>
                  {ROLES.map((item) => (
                    <SelectItem key={item.id} id={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isFiltered && (
                <Button variant="quiet" onPress={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
            <SegmentedControl
              aria-label="Filter by status"
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                if (typeof next === "string") {
                  setStatus(next)
                  setPage(1)
                }
              }}
            >
              <SegmentedControlItem id="all">
                All {counts.all}
              </SegmentedControlItem>
              <SegmentedControlItem id="active">
                Active {counts.active}
              </SegmentedControlItem>
              <SegmentedControlItem id="invited">
                Invited {counts.invited}
              </SegmentedControlItem>
              <SegmentedControlItem id="suspended">
                Suspended {counts.suspended}
              </SegmentedControlItem>
            </SegmentedControl>
          </div>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-muted bg-muted/50 px-3 py-2">
              <span className="text-sm font-medium tabular-nums">
                {selected.size} selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Menu>
                  <Button variant="secondary" size="sm">
                    <ShieldCheckIcon />
                    Change role
                  </Button>
                  <Popover placement="bottom end">
                    <MenuContent className="min-w-40">
                      {ROLES.filter((item) => item.id !== "owner").map(
                        (item) => (
                          <MenuItem key={item.id} id={item.id}>
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                    </MenuContent>
                  </Popover>
                </Menu>
                <Button variant="secondary" size="sm">
                  <MailCheckIcon />
                  Resend invites
                </Button>
                <Button variant="danger" size="sm">
                  <Trash2Icon />
                  Remove
                </Button>
              </div>
            </div>
          )}

          <TableContainer>
            <Table
              aria-label="Workspace members"
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={(keys) => {
                setSelected(
                  keys === "all"
                    ? new Set(rows.map((member) => member.id))
                    : new Set([...keys].map(String)),
                )
              }}
            >
              <TableHeader>
                <TableColumn isRowHeader>Member</TableColumn>
                <TableColumn className="w-44">Role</TableColumn>
                <TableColumn className="w-32">Status</TableColumn>
                <TableColumn className="w-40">Team</TableColumn>
                <TableColumn className="w-44">Last active</TableColumn>
                <TableColumn className="w-12">
                  <span className="sr-only">Actions</span>
                </TableColumn>
              </TableHeader>
              <TableBody
                renderEmptyState={() => (
                  <Empty className="py-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users2Icon />
                      </EmptyMedia>
                      <EmptyTitle>No members match</EmptyTitle>
                      <EmptyDescription>
                        Try a different search term, or clear the role and
                        status filters.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              >
                {rows.map((member) => (
                  <TableRow
                    key={member.id}
                    id={member.id}
                    textValue={member.name}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {initials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-xs text-fg-muted">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.role === "owner" ? (
                        <Badge appearance="subtle" variant="accent">
                          Owner
                        </Badge>
                      ) : (
                        <Select
                          aria-label={`Role for ${member.name}`}
                          defaultValue={member.role}
                          className="w-36"
                        >
                          <SelectTrigger size="sm" variant="quiet" />
                          <SelectContent>
                            {ROLES.filter((item) => item.id !== "owner").map(
                              (item) => (
                                <SelectItem key={item.id} id={item.id}>
                                  {item.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        appearance="subtle"
                        variant={STATUS_VARIANT[member.status]}
                      >
                        {STATUS_LABEL[member.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-fg-muted">
                      {member.team}
                    </TableCell>
                    <TableCell className="text-fg-muted">
                      {member.lastActive}
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions member={member} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg-muted tabular-nums">
              {filtered.length === 0
                ? "No members match the current filters"
                : `Showing ${firstRow}–${lastRow} of ${filtered.length} members`}
              {role !== "all" ? ` · ${ROLE_LABEL[role as Role]}` : ""}
            </p>
            <Pagination>
              <PaginationList>
                <PaginationItem>
                  <PaginationPrevious
                    isDisabled={currentPage === 1}
                    onPress={() => setPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                {pageWindow(currentPage, pageCount).map((item) => (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={item === currentPage}
                      aria-label={`Page ${item}`}
                      onPress={() => setPage(item)}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    isDisabled={currentPage === pageCount}
                    onPress={() =>
                      setPage(Math.min(pageCount, currentPage + 1))
                    }
                  />
                </PaginationItem>
              </PaginationList>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}
