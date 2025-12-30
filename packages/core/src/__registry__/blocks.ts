// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const blocksCategories = [
  {
    "name": "Featured",
    "slug": "featured"
  }
] as const;

export const blocks = [
  {
    "name": "login",
    "type": "registry:block",
    "dependencies": [
      "@internationalized/date"
    ],
    "registryDependencies": [
      "button",
      "text-field",
      "card",
      "link"
    ],
    "description": "A simple login form.",
    "categories": [
      "featured",
      "authentication"
    ],
    "meta": {
      "containerHeight": 600
    },
    "files": [
      {
        "type": "registry:page",
        "path": "blocks/auth/login/page.tsx",
        "target": "app/login/page.tsx",
        "content": `import { LoginForm } from "@dotui/registry/blocks/auth/login/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <LoginForm />
    </div>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/auth/login/components/login-form.tsx",
        "target": "blocks/auth/login/components/login-form.tsx",
        "content": `"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Link } from "@dotui/registry/ui/link";
import { TextField } from "@dotui/registry/ui/text-field";

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Card {...props} className={cn("w-full max-w-xs", props.className)}>
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex items-center gap-2 [&_button]:flex-1">
          <Button aria-label="Sign in with google">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
          </Button>
          <Button aria-label="Sign in with X">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </Button>
          <Button aria-label="Sign in with github">
            <svg
              viewBox="0 0 98 96"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
            </svg>
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-fg-muted">Or</span>
          </div>
        </div>
        <TextField className="w-full">
          <Label>Email address</Label>
          <Input />
        </TextField>
        <Button variant="primary" className="mt-4 w-full" type="submit">
          Continue with email
        </Button>
        <p className="mt-4 text-fg-muted text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" variant="quiet">
            register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
`
      }
    ]
  },
  {
    "name": "cards",
    "type": "registry:block",
    "registryDependencies": [
      "all"
    ],
    "description": "A set of cards.",
    "categories": [
      "featured",
      "showcase"
    ],
    "meta": {
      "containerHeight": 600
    },
    "files": [
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/cards.tsx",
        "target": "blocks/showcase/cards/components/cards.tsx",
        "content": `import { AccountMenu } from "@dotui/registry/blocks/showcase/cards/components/account-menu";
import { Backlog } from "@dotui/registry/blocks/showcase/cards/components/backlog";
import { Booking } from "@dotui/registry/blocks/showcase/cards/components/booking";
import { ColorEditorCard } from "@dotui/registry/blocks/showcase/cards/components/color-editor";
import { Filters } from "@dotui/registry/blocks/showcase/cards/components/filters";
import { InviteMembers } from "@dotui/registry/blocks/showcase/cards/components/invite-members";
import { LoginForm } from "@dotui/registry/blocks/showcase/cards/components/login-form";
import { Notifications } from "@dotui/registry/blocks/showcase/cards/components/notifications";
import { TeamName } from "@dotui/registry/blocks/showcase/cards/components/team-name";
import { cn } from "@dotui/registry/lib/utils";

export function Cards(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-11 gap-4 p-4 md:p-6", props.className)}
    >
      <div className="col-span-11 flex gap-4 max-md:flex-col xl:col-span-8">
        <Booking className="w-full max-md:col-span-1 md:w-80" />
        <Filters className="flex-1 max-md:col-span-1" />
      </div>
      <Notifications className="md:contain-[size] col-span-11 max-md:h-100 md:col-span-5 xl:col-span-3" />
      <InviteMembers className="col-span-11 md:col-span-6 lg:col-span-6 xl:col-span-4" />
      <Backlog className="col-span-11 lg:col-span-8 xl:col-span-7" />
      <AccountMenu className="max-lg:hidden lg:col-span-3 lg:block xl:hidden" />
      <div className="col-span-11 grid grid-cols-11 gap-4 lg:items-start">
        <AccountMenu className="col-span-11 min-w-0 sm:col-span-5 lg:hidden xl:col-span-2 xl:block" />
        <LoginForm className="col-span-11 max-w-none sm:col-span-6 lg:hidden" />
        <div className="col-span-11 flex items-start gap-4 max-sm:flex-col max-sm:items-stretch lg:col-span-7 xl:col-span-6">
          <ColorEditorCard className="max-sm:hidden" />
          <TeamName className="flex-1" />
        </div>
        <LoginForm className="hidden w-full max-w-none lg:col-span-4 lg:block xl:col-span-3" />
      </div>
    </div>
  );
}

export default Cards;
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/account-menu.tsx",
        "target": "blocks/showcase/cards/components/account-menu.tsx",
        "content": `"use client";

import {
  BookIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Card, CardContent, CardHeader } from "@dotui/registry/ui/card";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";
import { Separator } from "@dotui/registry/ui/separator";

export function AccountMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("min-w-56 gap-0 py-0", className)} {...props}>
      <CardHeader className="flex w-full items-center border-b px-4 py-3">
        <Avatar src="https://github.com/mehdibha.png" size="sm" />
        <div className="w-full text-sm">
          <p className="font-semibold">mehdibha</p>
          <p className="text-fg-muted">
            <span className="truncate">hello@mehdibha.com</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ListBox
          aria-label="Account Menu"
          className="h-full max-h-none w-full rounded-none border-0 bg-transparent **:data-[slot='list-box-item']:text-sm"
        >
          <ListBoxItem>
            <User2Icon />
            Profile
          </ListBoxItem>
          <ListBoxItem>
            <SettingsIcon />
            Settings
          </ListBoxItem>
          <ListBoxItem>
            <BookIcon />
            Documentation
          </ListBoxItem>
          <ListBoxItem>
            <Users2Icon />
            Community
          </ListBoxItem>
          <Separator />
          <ListBoxSection>
            <ListBoxSectionHeader>Preferences</ListBoxSectionHeader>
            <ListBoxItem>
              <ContrastIcon />
              Theme
            </ListBoxItem>
            <ListBoxItem>
              <LanguagesIcon />
              Language
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxItem>
            <LogOutIcon />
            Log out
          </ListBoxItem>
        </ListBox>
      </CardContent>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/backlog.tsx",
        "target": "blocks/showcase/cards/components/backlog.tsx",
        "content": `"use client";

import {
  RiCheckboxCircleFill,
  RiProgress4Line,
  RiProgress6Line,
} from "@remixicon/react";
import {
  AlertTriangle,
  Circle,
  CircleDashedIcon,
  MoreHorizontal,
  Settings2Icon,
  Zap,
} from "lucide-react";

import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Input } from "@dotui/registry/ui/input";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import { SearchField } from "@dotui/registry/ui/search-field";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@dotui/registry/ui/table";

export const statuses = [
  {
    value: "draft",
    label: "Draft",
    variant: "default",
    icon: CircleDashedIcon,
  },
  {
    value: "in progress",
    label: "In progress",
    variant: "info",
    icon: RiProgress4Line,
  },
  {
    value: "in review",
    label: "In review",
    variant: "warning",
    icon: RiProgress6Line,
  },
  {
    value: "done",
    label: "Done",
    variant: "success",
    icon: RiCheckboxCircleFill,
  },
] as const;

export const priorities = [
  {
    value: "P0",
    label: "P0",
    variant: "danger",
    icon: AlertTriangle,
  },
  {
    value: "P1",
    label: "P1",
    variant: "warning",
    icon: Zap,
  },
  {
    value: "P2",
    label: "P2",
    variant: "info",
    icon: Circle,
  },
  {
    value: "P3",
    label: "P3",
    variant: "default",
    icon: Circle,
  },
] as const;

export const types = [
  {
    value: "feature",
    label: "Feature",
    variant: "info",
  },
  {
    value: "bug",
    label: "Bug",
    variant: "danger",
  },
  {
    value: "tech debt",
    label: "Tech Debt",
    variant: "warning",
  },
  {
    value: "spike",
    label: "Spike",
    variant: "info",
  },
  {
    value: "chore",
    label: "Chore",
    variant: "neutral",
  },
  {
    value: "performance",
    label: "Performance",
    variant: "success",
  },
] as const;

interface Column {
  id: keyof Omit<Item, "id"> | "actions";
  name: string;
  isRowHeader?: boolean;
}

const columns: Column[] = [
  { name: "Title", id: "title", isRowHeader: true },
  { name: "Priority", id: "priority" },
  { name: "Status", id: "status" },
  { name: "Assignee", id: "assignee" },
  { name: "Story Points", id: "storyPoints" },
  { name: "", id: "actions" },
];

interface Item {
  id: number;
  title: string;
  priority: string;
  status: string;
  assignee: string;
  storyPoints: string;
  type: string;
}

interface User {
  username: string;
  name: string;
  avatar: string;
}

export const users: User[] = [
  {
    username: "shadcn",
    name: "shadcn",
    avatar: "https://github.com/shadcn.png",
  },
  {
    username: "tannerlinsley",
    name: "Tanner Linsley",
    avatar: "https://github.com/tannerlinsley.png",
  },
  {
    username: "t3dotgg",
    name: "Theo Browne",
    avatar: "https://github.com/t3dotgg.png",
  },
  {
    username: "rauchg",
    name: "Guillermo Rauch",
    avatar: "https://github.com/rauchg.png",
  },
  {
    username: "leerob",
    name: "Lee Robinson",
    avatar: "https://github.com/leerob.png",
  },
  {
    username: "steventey",
    name: "Steven Tey",
    avatar: "https://github.com/steventey.png",
  },
] as const;

const data: Item[] = [
  {
    id: 1,
    title: "Refactor AuthProvider to support SSO + 2FA",
    priority: "P0",
    status: "in progress",
    assignee: "shadcn",
    storyPoints: "13",
    type: "feature",
  },
  {
    id: 2,
    title: "Fix race condition in payment webhooks",
    priority: "P1",
    status: "in review",
    assignee: "tannerlinsley",
    storyPoints: "5",
    type: "bug",
  },
  {
    id: 3,
    title: "Migrate legacy API from REST to GraphQL",
    priority: "P2",
    status: "draft",
    assignee: "t3dotgg",
    storyPoints: "21",
    type: "tech debt",
  },
  {
    id: 4,
    title: "Add Storybook stories for Button variants",
    priority: "P3",
    status: "done",
    assignee: "rauchg",
    storyPoints: "3",
    type: "chore",
  },
  {
    id: 5,
    title: "Spike: Evaluate Redis vs Kafka for event streaming",
    priority: "P2",
    status: "in progress",
    assignee: "leerob",
    storyPoints: "8",
    type: "spike",
  },
  {
    id: 6,
    title: "Implement lazy loading for ProductGrid component",
    priority: "P1",
    status: "draft",
    assignee: "steventey",
    storyPoints: "5",
    type: "performance",
  },
];

export function Backlog(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Backlog</CardTitle>
        <CardDescription>
          Here's a list of your tasks for this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SearchField aria-label="Filter tasks">
              <Input size="sm" placeholder="Filter tasks" />
            </SearchField>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Settings2Icon />
              View
            </Button>
            <Button variant="primary" size="sm">
              Add task
            </Button>
          </div>
        </div>
        <Table
          aria-label="Development Team Backlog"
          selectionMode="multiple"
          className="mt-4"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn isRowHeader={column.isRowHeader}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data}>
            {(item) => (
              <TableRow columns={columns}>
                <TableCell>
                  {() => {
                    const type = types.find((t) => t.value === item.type);
                    if (!type) return null;
                    return (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {type?.label || item.type}
                        </Badge>
                        <span className="truncate">{item.title}</span>
                      </div>
                    );
                  }}
                </TableCell>
                <TableCell>
                  {(() => {
                    const priority = priorities.find(
                      (p) => p.value === item.priority,
                    );
                    if (!priority) return null;
                    return (
                      <Badge variant={priority.variant}>{priority.label}</Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const status = statuses.find(
                      (s) => s.value === item.status,
                    );
                    if (!status) return null;
                    const StatusIcon = status.icon || Circle;
                    return (
                      <Badge variant={status.variant}>
                        <StatusIcon />
                        <span>{status?.label || item.status}</span>
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const user = users.find(
                      (u) => u.username === item.assignee,
                    );
                    if (!user) return null;
                    return (
                      <div className="flex items-center space-x-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-fg-muted">{user.name}</span>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Badge className="bg-accent-muted px-1 text-fg-accent">
                    {item.storyPoints}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Menu>
                    <Button variant="quiet" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <Overlay type="popover">
                      <MenuContent>
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Duplicate</MenuItem>
                        <MenuItem>Archive</MenuItem>
                        <MenuItem variant="danger">Delete</MenuItem>
                      </MenuContent>
                    </Overlay>
                  </Menu>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/booking.tsx",
        "target": "blocks/showcase/cards/components/booking.tsx",
        "content": `"use client";

import { parseDate } from "@internationalized/date";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Calendar } from "@dotui/registry/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export function Booking({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Booking</CardTitle>
        <CardDescription>Pick a time for your meeting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Calendar
          className="border-0 bg-transparent p-0"
          defaultValue={parseDate("2025-09-23")}
        />
        <div className="grid grid-cols-2 gap-2">
          <TimeField>
            <Label>Start time</Label>
            <Input />
          </TimeField>
          <TimeField>
            <Label>End time</Label>
            <Input />
          </TimeField>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Dismiss</Button>
        <Button variant="primary">Apply</Button>
      </CardFooter>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/color-editor.tsx",
        "target": "blocks/showcase/cards/components/color-editor.tsx",
        "content": `"use client";

import { cn } from "@dotui/registry/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { ColorEditor } from "@dotui/registry/ui/color-editor";

export function ColorEditorCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Accent color</CardTitle>
        <CardDescription>Edit the accent color of the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorEditor />
      </CardContent>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/filters.tsx",
        "target": "blocks/showcase/cards/components/filters.tsx",
        "content": `"use client";

// import { ZapIcon } from "lucide-react";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Description, Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@dotui/registry/ui/slider";
import { Switch } from "@dotui/registry/ui/switch";
import { Tag, TagGroup, TagList } from "@dotui/registry/ui/tag-group";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export function Filters({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label id="type-of-place">Type of place</Label>
          <ToggleButtonGroup
            aria-labelledby="type-of-place"
            selectionMode="single"
            defaultSelectedKeys={["any-type"]}
            className="grid w-full grid-cols-3"
          >
            <ToggleButton id="any-type">Any type</ToggleButton>
            <ToggleButton id="room">Room</ToggleButton>
            <ToggleButton id="entire-home">Entire home</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Slider
          defaultValue={[200, 800]}
          minValue={0}
          maxValue={2000}
          className="w-full"
        >
          <div className="flex justify-between gap-2">
            <Label>Price Range</Label>
            <SliderOutput />
          </div>
          <SliderControl />
          <Description>Trip price, includes all fees</Description>
        </Slider>
        <TagGroup>
          <Label>Amenities</Label>
          <TagList>
            <Tag>Wifi</Tag>
            <Tag>TV</Tag>
            <Tag>Kitchen</Tag>
            <Tag>Pool</Tag>
            <Tag>Washer</Tag>
            <Tag>Dryer</Tag>
            <Tag>Heating</Tag>
            <Tag>Hair dryer</Tag>
            <Tag>EV charger</Tag>
            <Tag>Gym</Tag>
            <Tag>BBQ grill</Tag>
            <Tag>Breakfast</Tag>
          </TagList>
        </TagGroup>
        <Switch
          //  variant="card"
          className="text-sm"
          defaultSelected
        >
          <span className="flex items-center gap-2">
            {/* <ZapIcon className="size-4" /> */}
            Instant booking
          </span>
        </Switch>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Clear all</Button>
        <Button variant="primary">Show results</Button>
      </CardFooter>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/invite-members.tsx",
        "target": "blocks/showcase/cards/components/invite-members.tsx",
        "content": `"use client";

import { PlusCircleIcon } from "lucide-react";

import { ExternalLinkIcon } from "@dotui/registry/icons";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Separator } from "@dotui/registry/ui/separator";
import { TextField } from "@dotui/registry/ui/text-field";

const teamMembers = [
  {
    name: "shadcn",
    email: "shadcn@vercel.com",
    avatar: "https://github.com/shadcn.png",
    role: "owner",
  },
  {
    name: "rauchg",
    email: "rauchg@vercel.com",
    avatar: "https://github.com/rauchg.png",
    role: "member",
  },
  {
    name: "Lee Robinson",
    email: "lee@cursor.com",
    avatar: "https://github.com/leerob.png",
    role: "member",
  },
];

export function InviteMembers(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Collaborate with members on this project.
        </CardDescription>
        <CardAction>
          <Button variant="default">
            <ExternalLinkIcon />
            Invite link
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TextField className="flex-1">
              <Label>Email</Label>
              <Input />
            </TextField>
            <Select defaultValue="member">
              <Label>Role</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="owner">Owner</SelectItem>
                <SelectItem id="member">Member</SelectItem>
                <SelectItem id="admin">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <PlusCircleIcon />
            Add more
          </Button>
          <div>
            <p>Team members</p>
            <div className="mt-2 space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar src={member.avatar} size="sm" />
                    <div className="text-sm">
                      <p>{member.name}</p>
                      <p className="text-fg-muted">{member.role}</p>
                    </div>
                  </div>
                  <Select aria-label="Role" defaultValue={member.role}>
                    <SelectTrigger />
                    <SelectContent>
                      <SelectItem id="owner">Owner</SelectItem>
                      <SelectItem id="member">Member</SelectItem>
                      <SelectItem id="admin">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between">
        <p className="text-fg-muted text-sm">
          Learn more about{" "}
          <a href="#" className="text-fg-accent underline underline-offset-4">
            inviting members
          </a>
          .
        </p>
        <Button variant="primary">Invite</Button>
      </CardFooter>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/login-form.tsx",
        "target": "blocks/showcase/cards/components/login-form.tsx",
        "content": `"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Link } from "@dotui/registry/ui/link";
import { TextField } from "@dotui/registry/ui/text-field";

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Card {...props} className={cn("w-full max-w-xs", props.className)}>
      <CardHeader>
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex items-center gap-2 [&_button]:flex-1">
          <Button aria-label="Sign in with google">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
          </Button>
          <Button aria-label="Sign in with X">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </Button>
          <Button aria-label="Sign in with github">
            <svg
              viewBox="0 0 98 96"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
            </svg>
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-fg-muted">Or</span>
          </div>
        </div>
        <TextField>
          <Label>Email address</Label>
          <Input type="email" />
        </TextField>
        <Button variant="primary" className="mt-4 w-full" type="submit">
          Continue with email
        </Button>
        <p className="mt-4 text-fg-muted text-sm">
          {/* TODO */}
          Don&apos;t have an account?{" "}
          <Link href="#" variant="quiet">
            register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/notifications.tsx",
        "target": "blocks/showcase/cards/components/notifications.tsx",
        "content": `import React from "react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Separator } from "@dotui/registry/ui/separator";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

export function Notifications({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("gap-2 pb-0", className)} {...props}>
      <CardHeader className="flex min-w-0 items-center justify-between has-data-[slot=card-action]:grid-cols-[1fr_minmax(0,auto)]">
        <CardTitle className="flex items-center gap-2">
          Notifications
          <Badge className="px-1.5">12</Badge>
        </CardTitle>
        <CardAction>
          <Button size="sm">
            <span className="truncate">Mark all as read</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-0">
        <Tabs className="flex h-full min-h-0 flex-col">
          <TabList className="shrink-0 pl-6">
            <Tab id="all">All</Tab>
            <Tab id="unread">Unread</Tab>
            <Tab id="read">Read</Tab>
          </TabList>
          {["all", "unread", "read"].map((tab) => (
            <TabPanel
              key={tab}
              id={tab}
              className="mt-0 min-h-0 flex-1 overflow-y-auto"
            >
              <ListBox
                aria-label="Notifications"
                className="max-h-none w-full rounded-none border-0 bg-transparent p-0 **:data-[slot=list-box-item]:rounded-none [&_.separator]:my-0"
              >
                {notifications
                  .filter((notification) => {
                    if (tab === "all") return true;
                    if (tab === "unread") return !notification.read;
                    if (tab === "read") return notification.read;
                    return false;
                  })
                  .map((notification, index) => (
                    <React.Fragment key={index}>
                      <Separator />
                      <ListBoxItem textValue={notification.text}>
                        <div className="flex items-start gap-3 py-2">
                          <Avatar
                            src={notification.user.avatar}
                            fallback={notification.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                            size="md"
                          />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">
                                {notification.user.name}
                              </span>{" "}
                              {notification.content ? (
                                notification.content
                              ) : (
                                <span>{notification.text}</span>
                              )}
                            </p>
                            <div className="mt-1 flex items-start justify-between gap-2">
                              <p className="text-fg-muted text-xs">
                                {notification.timestamp}
                              </p>
                              {notification.action && (
                                <div className="mt-2 flex justify-end">
                                  <Button size="sm">
                                    {notification.action.label}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ListBoxItem>
                    </React.Fragment>
                  ))}
              </ListBox>
            </TabPanel>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

const notifications = [
  {
    user: {
      name: "Guillermo Rauch",
      avatar: "https://avatars.githubusercontent.com/rauchg",
    },
    text: "starred your repository dotUI.",
    content: (
      <>
        starred <span className="font-semibold">mehdibha/dotUI</span>.
      </>
    ),
    read: false,
    timestamp: "2 hours ago",
  },
  {
    user: {
      name: "Lee Robinson",
      avatar: "https://avatars.githubusercontent.com/leerob",
    },
    text: "invited you to the Vercel GitHub organization.",
    content: (
      <>
        invited you to join <span className="font-semibold">Cursor</span> on
        GitHub.
      </>
    ),
    read: false,
    action: { label: "View invite" },
    timestamp: "7 hours ago",
  },
  {
    user: {
      name: "Tim Neutkens",
      avatar: "https://avatars.githubusercontent.com/timneutkens",
    },
    text: "published a new release v14.2.0-canary on vercel/next.js.",
    content: (
      <>
        published <span className="font-semibold">v14.2.0-canary</span> on
        <span className="font-semibold"> vercel/next.js</span>.
      </>
    ),
    read: false,
    action: { label: "See release" },
    timestamp: "Yesterday",
  },
  {
    user: {
      name: "Steven Tey",
      avatar: "https://avatars.githubusercontent.com/steven-tey",
    },
    text: "opened a pull request: Improve docs.",
    content: (
      <>
        opened <span className="font-semibold">PR</span>:
        <span className="font-semibold"> Improve docs</span> in
        <span className="font-semibold"> mehdibha/dotUI</span>.
      </>
    ),
    read: true,
    action: { label: "Review PR" },
    timestamp: "Yesterday",
  },
  {
    user: {
      name: "Shu Ding",
      avatar: "https://avatars.githubusercontent.com/shuding",
    },
    text: "starred your repository dotUI.",
    content: (
      <>
        starred <span className="font-semibold">mehdibha/dotUI</span>.
      </>
    ),
    read: true,
    timestamp: "2 days ago",
  },
  {
    user: {
      name: "Delba de Oliveira",
      avatar: "https://avatars.githubusercontent.com/delbaoliveira",
    },
    text: "commented on issue: Add theme presets.",
    content: (
      <>
        commented on <span className="font-semibold">#128</span>:
        <span className="font-semibold"> Add theme presets</span>.
      </>
    ),
    read: false,
    action: { label: "Reply" },
    timestamp: "3 days ago",
  },
];
`
      },
      {
        "type": "registry:component",
        "path": "blocks/showcase/cards/components/team-name.tsx",
        "target": "blocks/showcase/cards/components/team-name.tsx",
        "content": `"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export function TeamName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Team Name</CardTitle>
        <CardDescription>
          This is your team's visible name within the platform. For example, the
          name of your company or department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TextField aria-label="Team Name" defaultValue="My Team">
          <Input />
        </TextField>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <p className="text-fg-muted text-sm">
          Please use 32 characters at maximum.
        </p>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  );
}
`
      }
    ]
  }
] as const;
