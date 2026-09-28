import { createContext, useContext } from "react"

import {
  BellIcon,
  CheckIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CreditCardIcon,
  DownloadIcon,
  GitBranchIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SparklesIcon,
  SunIcon,
} from "@/registry/icons"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"

/* A few cards in the showcase's idiom, for coverage the landing set lacks
   without names, logos or remote images. */

/** The mode the look is filmed in — cards that show a theme choice pick it. */
export const LookMode = createContext<"light" | "dark">("dark")

const THEMES = [
  { id: "light", label: "Light", icon: SunIcon },
  { id: "dark", label: "Dark", icon: MoonIcon },
  { id: "system", label: "System", icon: MonitorIcon },
]

const ACCENTS = [
  "bg-primary",
  "bg-info",
  "bg-success",
  "bg-warning",
  "bg-danger",
  "bg-accent",
]

/** The showcase's Appearance card, with the theme the look is in. */
export function Appearance() {
  const mode = useContext(LookMode)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Theme</Label>
          <SegmentedControl
            aria-label="Theme"
            selectedKeys={new Set([mode])}
            className="grid w-full grid-cols-3"
          >
            {THEMES.map((t) => (
              <SegmentedControlItem key={t.id} id={t.id}>
                <t.icon className="size-4" aria-hidden />
                {t.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label>Accent</Label>
          <div className="flex items-center gap-2">
            {ACCENTS.map((bg, i) => (
              <span
                key={bg}
                className={`size-6 rounded-full ${bg} ${i === 0 ? "ring-2 ring-fg ring-offset-2 ring-offset-bg" : ""}`}
              />
            ))}
          </div>
        </div>
        <Switch className="w-full justify-between text-sm">
          <Label>Reduce motion</Label>
          <SwitchControl />
        </Switch>
      </CardContent>
    </Card>
  )
}

export function SignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue to your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField>
          <Label>Email</Label>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <Input defaultValue="maya@acme.dev" />
          </InputGroup>
        </TextField>
        <TextField type="password">
          <Label>Password</Label>
          <Input defaultValue="correcthorse" />
        </TextField>
        <div className="flex items-center justify-between gap-2">
          <Checkbox defaultSelected>Remember me</Checkbox>
          <span className="text-sm text-fg-muted">Forgot password?</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Sign in
        </Button>
      </CardFooter>
    </Card>
  )
}

const PEOPLE = [
  { name: "Maya Chen", email: "maya@acme.dev", role: "Owner" },
  { name: "Leo Park", email: "leo@acme.dev", role: "Admin" },
  { name: "Sam Ortiz", email: "sam@acme.dev", role: "Member" },
]

export function Team() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>3 members · 2 seats left</CardDescription>
        <CardAction>
          <Button size="sm">
            <PlusIcon />
            Invite
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {PEOPLE.map((person) => (
          <div key={person.name} className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">{person.name}</p>
              <p className="truncate text-fg-muted">{person.email}</p>
            </div>
            <Badge variant={person.role === "Owner" ? "accent" : "neutral"}>
              {person.role}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const ALERTS = [
  { label: "Mentions", description: "When someone @mentions you.", on: true },
  { label: "Weekly digest", description: "A summary every Monday.", on: true },
  {
    label: "Product updates",
    description: "New features and fixes.",
    on: false,
  },
]

export function Alerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="size-4" />
          Notifications
        </CardTitle>
        <CardDescription>Choose what reaches your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ALERTS.map((alert) => (
          <Switch
            key={alert.label}
            defaultSelected={alert.on}
            className="w-full justify-between gap-3"
          >
            <FieldContent>
              <Label>{alert.label}</Label>
              <Description>{alert.description}</Description>
            </FieldContent>
            <SwitchControl />
          </Switch>
        ))}
      </CardContent>
    </Card>
  )
}

const STEPS = [
  { label: "Create your workspace", done: true },
  { label: "Invite your team", done: true },
  { label: "Connect a domain", done: true },
  { label: "Ship your first page", done: false },
]

export function Onboarding() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting started</CardTitle>
        <CardAction>
          <Badge variant="accent">
            <SparklesIcon />
            New
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultSelectedKey="setup">
          <TabList aria-label="Onboarding">
            <Tab id="setup">Setup</Tab>
            <Tab id="guides">Guides</Tab>
            <Tab id="help">Help</Tab>
          </TabList>
        </Tabs>
        <ProgressBar aria-label="Progress" value={75} className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Label>3 of 4 complete</Label>
            <ProgressBarOutput />
          </div>
          <ProgressBarControl>
            <ProgressBarFill />
          </ProgressBarControl>
        </ProgressBar>
        <Separator />
        <ul className="space-y-2.5 text-sm">
          {STEPS.map((step) => (
            <li key={step.label} className="flex items-center gap-2.5">
              <span
                className={
                  step.done
                    ? "flex size-5 items-center justify-center rounded-full bg-primary text-fg-on-primary"
                    : "size-5 rounded-full border"
                }
              >
                {step.done ? <CheckIcon className="size-3" /> : null}
              </span>
              <span className={step.done ? "text-fg-muted line-through" : ""}>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function Topics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
        <CardDescription>Follow what you care about.</CardDescription>
      </CardHeader>
      <CardContent>
        <TagGroup
          aria-label="Topics"
          selectionMode="multiple"
          defaultSelectedKeys={["design", "motion", "a11y"]}
        >
          <TagList>
            <Tag id="design">Design</Tag>
            <Tag id="motion">Motion</Tag>
            <Tag id="type">Typography</Tag>
            <Tag id="a11y">Accessibility</Tag>
            <Tag id="color">Color</Tag>
            <Tag id="systems">Systems</Tag>
          </TagList>
        </TagGroup>
      </CardContent>
    </Card>
  )
}

const FEATURES = ["Unlimited projects", "Custom domains", "Priority support"]

export function Billing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pro</CardTitle>
        <CardDescription>Everything a growing team needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SegmentedControl
          aria-label="Billing period"
          defaultSelectedKeys={["yearly"]}
          className="w-full"
        >
          <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
        </SegmentedControl>
        <p className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-semibold tracking-tight">
            $16
          </span>
          <span className="text-sm text-fg-muted">/ month, billed yearly</span>
        </p>
        <ul className="space-y-2 text-sm">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="size-4 text-fg-accent" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Upgrade to Pro
        </Button>
      </CardFooter>
    </Card>
  )
}

const QUOTAS = [
  { label: "Seats", value: 80, output: "8 / 10" },
  { label: "Storage", value: 62, output: "62%" },
  { label: "Requests", value: 34, output: "34%" },
]

export function Quotas() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>Resets in 12 days.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {QUOTAS.map((quota) => (
          <ProgressBar
            key={quota.label}
            aria-label={quota.label}
            value={quota.value}
            className="w-full"
          >
            <div className="flex items-center justify-between gap-2 text-sm">
              <Label>{quota.label}</Label>
              <span className="text-fg-muted tabular-nums">{quota.output}</span>
            </div>
            <ProgressBarControl>
              <ProgressBarFill />
            </ProgressBarControl>
          </ProgressBar>
        ))}
      </CardContent>
    </Card>
  )
}

const SPEEDS = [
  {
    id: "standard",
    label: "Standard",
    description: "4–6 business days",
    price: "Free",
  },
  {
    id: "express",
    label: "Express",
    description: "2–3 business days",
    price: "$9",
  },
  {
    id: "overnight",
    label: "Overnight",
    description: "Next morning",
    price: "$24",
  },
]

export function Shipping() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery</CardTitle>
        <CardDescription>Pick how fast it gets there.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup aria-label="Delivery" defaultValue="express">
          <FieldGroup>
            {SPEEDS.map((speed) => (
              <Radio key={speed.id} value={speed.id}>
                <RadioControl>
                  <RadioIndicator />
                  <FieldContent className="flex-1">
                    <Label>{speed.label}</Label>
                    <Description>{speed.description}</Description>
                  </FieldContent>
                  <span className="text-sm font-medium tabular-nums">
                    {speed.price}
                  </span>
                </RadioControl>
              </Radio>
            ))}
          </FieldGroup>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export function Profile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How others see you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <Button size="sm" variant="secondary">
            Change photo
          </Button>
        </div>
        <TextField>
          <Label>Display name</Label>
          <Input defaultValue="Maya Chen" />
        </TextField>
        <Switch defaultSelected className="w-full justify-between gap-3">
          <FieldContent>
            <Label>Public profile</Label>
            <Description>Show your activity to the team.</Description>
          </FieldContent>
          <SwitchControl />
        </Switch>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  )
}

const BUILDS = [
  { branch: "main", status: "Ready", time: "2m ago" },
  { branch: "feat/billing", status: "Building", time: "now" },
  { branch: "fix/header", status: "Ready", time: "1h ago" },
]

export function Deploys() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
        <CardDescription>Production and previews.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {BUILDS.map((build) => (
          <div key={build.branch} className="flex items-center gap-2.5 text-sm">
            {build.status === "Ready" ? (
              <CircleCheckIcon className="size-4 shrink-0 text-fg-success" />
            ) : (
              <CircleDashedIcon className="size-4 shrink-0 text-fg-warning" />
            )}
            <GitBranchIcon className="size-3.5 shrink-0 text-fg-muted" />
            <span className="min-w-0 flex-1 truncate font-mono">
              {build.branch}
            </span>
            <Badge variant={build.status === "Ready" ? "success" : "warning"}>
              {build.status}
            </Badge>
          </div>
        ))}
        <Alert variant="info">
          <SparklesIcon />
          <AlertTitle>Preview ready</AlertTitle>
          <AlertDescription>Share it with your team.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

const LINES = [
  { item: "Pro plan · 5 seats", amount: "$80.00" },
  { item: "Extra storage", amount: "$12.00" },
  { item: "Discount", amount: "−$9.20" },
]

export function Invoice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice #0042</CardTitle>
        <CardDescription>Due March 1</CardDescription>
        <CardAction>
          <Badge variant="accent">Open</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm">
        {LINES.map((line) => (
          <div key={line.item} className="flex justify-between gap-2">
            <span className="text-fg-muted">{line.item}</span>
            <span className="tabular-nums">{line.amount}</span>
          </div>
        ))}
        <Separator />
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium">Total</span>
          <span className="font-heading text-2xl font-semibold tabular-nums">
            $82.80
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" isIconOnly aria-label="Download">
          <DownloadIcon />
        </Button>
        <Button variant="primary" className="flex-1">
          <CreditCardIcon />
          Pay now
        </Button>
      </CardFooter>
    </Card>
  )
}

const TODOS = [
  { label: "Pick a type scale", done: true },
  { label: "Set the brand color", done: true },
  { label: "Tune the radius", done: false },
  { label: "Export to code", done: false },
]

export function Tasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This week</CardTitle>
        <CardDescription>2 of 4 done</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {TODOS.map((todo) => (
          <Checkbox key={todo.label} defaultSelected={todo.done}>
            {todo.label}
          </Checkbox>
        ))}
      </CardContent>
    </Card>
  )
}
