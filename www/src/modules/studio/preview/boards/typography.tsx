import {
  CalendarIcon,
  CopyIcon,
  CreditCardIcon,
  FolderIcon,
  InboxIcon,
  LogOutIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from "@/registry/__generated__/icons"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { Link } from "@/registry/ui/link"
import {
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Message, MessageContent } from "@/registry/ui/message"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"

import { Board, BoardSection, CAPTION } from "./board"

const STACK = "flex-col flex-nowrap items-stretch justify-start gap-8"

/* Sizes are the specimen's; face, weight and tracking are the title recipe's. */
const TITLES = [
  {
    label: "Display",
    Tag: "h1",
    size: "text-4xl sm:text-5xl",
    text: "Design once, ship everywhere",
  },
  { label: "H1", Tag: "h1", size: "text-4xl", text: "A system you own" },
  { label: "H2", Tag: "h2", size: "text-3xl", text: "Components that compose" },
  { label: "H3", Tag: "h3", size: "text-2xl", text: "Tokens, not hex codes" },
  { label: "H4", Tag: "h4", size: "text-xl", text: "Release notes" },
] as const

function Specimen({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <div className={CAPTION}>{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

/** A menu frozen open: the popover's own surface around a standalone list. */
function MenuPanel({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const { popover } = usePopoverStyles()()
  return (
    <div className={popover({ className: "w-56 shrink-0" })}>
      <MenuContent aria-label={label}>{children}</MenuContent>
    </div>
  )
}

export default function TypographyBoard() {
  return (
    <Board id="typography">
      <BoardSection
        member="titles"
        title="Titles"
        axes={["headingFont", "titleStyle"]}
        className={STACK}
      >
        <div className="flex flex-col gap-6">
          {TITLES.map(({ label, Tag, size, text }) => (
            <Specimen key={label} label={label}>
              <Tag className={`${size} text-balance`}>{text}</Tag>
            </Specimen>
          ))}
        </div>
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Team</CardTitle>
              <CardDescription>
                Shared workspaces, roles and audit logs for up to 50 people.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="primary" size="sm">
                Upgrade
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Usage this month</CardTitle>
              <CardDescription>
                18,240 requests across 4 projects, 61% of your plan.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" size="sm">
                View report
              </Button>
            </CardFooter>
          </Card>
        </div>
      </BoardSection>

      <BoardSection
        member="body"
        title="Body"
        axes={["bodyFont"]}
        className={STACK}
      >
        <Specimen label="Paragraph">
          <p className="max-w-prose text-base">
            Every visual decision is an axis: color, type, radius, density and
            per-component styles. Preview each change on real components, then
            export code that reads like your own. Start with the{" "}
            <Link href="#">quick start guide</Link>.
          </p>
        </Specimen>
        <Specimen label="Small">
          <p className="max-w-prose text-sm">
            Invites expire after 7 days. Members you remove keep read access to
            projects they created until you transfer ownership.
          </p>
        </Specimen>
        <Specimen label="Caption">
          <p className="text-xs text-fg-muted">
            Last edited 3 minutes ago by Maya Chen · Visible to Acme
          </p>
        </Specimen>
      </BoardSection>

      <BoardSection
        member="reading"
        title="Reading"
        axes={["readingFont"]}
        className="grid items-start justify-stretch gap-10 md:grid-cols-[3fr_2fr]"
      >
        <article className="flex max-w-prose flex-col gap-3">
          <p className="text-xs text-fg-muted">Field notes · 4 min read</p>
          <h3 className="font-reading text-2xl text-balance">
            Why the best tools disappear
          </h3>
          <p className="font-reading text-[17px] leading-relaxed">
            A good tool asks for your attention once, when you learn it, and
            never again. After that it should fade into the work, the way a
            well-set page lets you forget the typeface and follow the argument.
          </p>
          <p className="font-reading text-[17px] leading-relaxed">
            The craft is in what you leave out.
          </p>
        </article>
        <div className="flex flex-col gap-3">
          <Message align="end">
            <MessageContent>
              <Bubble align="end">
                <BubbleContent>
                  Can you summarize the launch plan?
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent>
              <Bubble variant="muted">
                <BubbleContent>
                  <p>
                    Beta opens Monday for existing teams. Pricing goes live the
                    week after, once support has the new docs.
                  </p>
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </div>
      </BoardSection>

      <BoardSection
        member="mono"
        title="Mono"
        axes={["monoFont"]}
        className={STACK}
      >
        <pre className="overflow-x-auto rounded-(--studio-radius-container) bg-muted p-4 font-mono text-[13px] leading-relaxed">
          {`import { Button } from "@/components/ui/button"

export function Save({ pending }: { pending: boolean }) {
  return <Button isPending={pending}>Save changes</Button>
}`}
        </pre>
        <p className="text-sm">
          Run{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]">
            pnpm dlx shadcn add button
          </code>
          , then press{" "}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>{" "}
          to search components.
        </p>
      </BoardSection>

      <BoardSection member="labels" title="Labels" axes={["labelWeight"]}>
        <Button variant="primary">Create project</Button>
        <Button variant="secondary">Invite</Button>
        <Button variant="quiet">Cancel</Button>
        <ToggleButtonGroup aria-label="Range" defaultSelectedKeys={["week"]}>
          <ToggleButton id="day">Day</ToggleButton>
          <ToggleButton id="week">Week</ToggleButton>
          <ToggleButton id="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </BoardSection>

      <BoardSection
        member="section-labels"
        title="Section labels"
        axes={["sectionLabels"]}
        className="items-start gap-8"
      >
        <MenuPanel label="Account">
          <MenuSection>
            <MenuSectionHeader>Account</MenuSectionHeader>
            <MenuItem>
              <UserIcon />
              Profile
            </MenuItem>
            <MenuItem>
              <CreditCardIcon />
              Billing
            </MenuItem>
          </MenuSection>
          <Separator />
          <MenuSection>
            <MenuSectionHeader>Workspace</MenuSectionHeader>
            <MenuItem>
              <SettingsIcon />
              Settings
            </MenuItem>
            <MenuItem>
              <LogOutIcon />
              Sign out
            </MenuItem>
          </MenuSection>
        </MenuPanel>
        <SidebarProvider className="min-h-0 w-auto">
          <Sidebar
            collapsible="none"
            className="h-auto w-56 rounded-(--studio-radius-container) border"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <InboxIcon />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FolderIcon />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Favorites</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <StarIcon />
                      <span>Q4 roadmap</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </BoardSection>

      <BoardSection
        member="field-text"
        title="Field text"
        axes={["fieldTextSize"]}
      >
        <div className="grid w-full max-w-xl gap-x-6 gap-y-5 sm:grid-cols-2">
          <TextField defaultValue="Maya Chen">
            <Label>Full name</Label>
            <Input />
          </TextField>
          <TextField defaultValue="maya@acme.com">
            <Label>Email</Label>
            <Input />
          </TextField>
          <Select defaultValue="pro">
            <Label>Plan</Label>
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="hobby">Hobby</SelectItem>
              <SelectItem id="pro">Pro</SelectItem>
              <SelectItem id="team">Team</SelectItem>
            </SelectContent>
          </Select>
          <TextField defaultValue="Berlin, Germany">
            <Label>Location</Label>
            <Input />
          </TextField>
          <TextField
            className="sm:col-span-2"
            defaultValue="Product designer working on design systems and developer tools."
          >
            <Label>Bio</Label>
            <TextArea rows={2} />
          </TextField>
        </div>
      </BoardSection>

      <BoardSection
        member="ui-text"
        title="UI text"
        axes={["uiTextSize"]}
        className="items-start gap-8"
      >
        <div className="flex min-w-0 flex-1 basis-80 flex-col gap-6">
          <Tabs defaultSelectedKey="invoices">
            <TabList aria-label="Billing">
              <Tab id="overview">Overview</Tab>
              <Tab id="invoices">Invoices</Tab>
              <Tab id="settings">Settings</Tab>
            </TabList>
            <TabPanel id="overview" />
            <TabPanel id="invoices" />
            <TabPanel id="settings" />
          </Tabs>
          <TableContainer>
            <Table aria-label="Invoices">
              <TableHeader>
                <TableColumn isRowHeader>Invoice</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Amount</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>INV-2031</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$1,240.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-2030</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>$860.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV-2029</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$2,115.50</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <MenuPanel label="Invoice actions">
          <MenuItem>
            <CopyIcon />
            Duplicate
            <Kbd>⌘D</Kbd>
          </MenuItem>
          <MenuItem>
            <CalendarIcon />
            Reschedule
          </MenuItem>
          <MenuItem>
            <FolderIcon />
            Move to archive
          </MenuItem>
        </MenuPanel>
      </BoardSection>
    </Board>
  )
}
