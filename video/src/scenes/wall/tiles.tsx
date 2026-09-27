import type { ReactNode } from "react"
import { memo } from "react"

import {
  ArrowRightIcon,
  BellIcon,
  BoldIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  HeartIcon,
  InfoIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  MailIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  SparklesIcon,
  TrashIcon,
  UnderlineIcon,
  UploadIcon,
} from "@/registry/icons"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from "@/registry/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { DateField } from "@/registry/ui/date-field"
import { Description, Label } from "@/registry/ui/field"
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
} from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Loader } from "@/registry/ui/loader"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
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
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"

// video/ has no direct dependency on it; resolve through www like the registry does.
import { CalendarDate } from "../../../../www/node_modules/@internationalized/date"

/* The wall's cast: real registry components, one per cell, in the builder's
   untouched default look. `tick` is the beat index — the few tiles that live
   on the beat re-render only when it changes. */

type Render = (tick: number) => ReactNode

const DAY = new CalendarDate(2026, 10, 14)

export const TILES: Record<string, Render> = {
  radio: () => (
    <RadioGroup defaultValue="direct" aria-label="Notify me about">
      <Label>Notify me about</Label>
      <Radio value="all">
        <RadioControl />
        <Label>All new messages</Label>
      </Radio>
      <Radio value="direct" className="wall-hero">
        <RadioControl />
        <Label>Direct messages</Label>
      </Radio>
      <Radio value="none">
        <RadioControl />
        <Label>Nothing</Label>
      </Radio>
    </RadioGroup>
  ),
  primary: () => <Button variant="primary">Get started</Button>,
  secondary: () => (
    <div className="flex gap-2">
      <Button>Cancel</Button>
      <Button variant="primary">Save</Button>
    </div>
  ),
  danger: () => (
    <Button variant="danger">
      <TrashIcon data-icon="inline-start" />
      Delete
    </Button>
  ),
  quiet: () => (
    <Button variant="quiet">
      Learn more
      <ArrowRightIcon data-icon="inline-end" />
    </Button>
  ),
  icons: () => (
    <div className="flex gap-2">
      <Button isIconOnly aria-label="Add">
        <PlusIcon />
      </Button>
      <Button isIconOnly aria-label="Copy">
        <CopyIcon />
      </Button>
      <Button isIconOnly aria-label="Settings">
        <SettingsIcon />
      </Button>
    </div>
  ),
  share: () => (
    <Button>
      <ShareIcon data-icon="inline-start" />
      Share
    </Button>
  ),
  switch: (tick) => (
    <Switch isSelected={tick % 4 < 2} aria-label="Airplane mode">
      <SwitchControl />
      <Label>Airplane mode</Label>
    </Switch>
  ),
  switch2: (tick) => (
    <Switch isSelected={(tick + 1) % 4 < 3} aria-label="Notifications">
      <SwitchControl />
      <Label>Notifications</Label>
    </Switch>
  ),
  checkbox: (tick) => (
    <Checkbox isSelected={tick % 3 !== 0} aria-label="Remember me">
      <CheckboxControl />
      <Label>Remember me</Label>
    </Checkbox>
  ),
  checkbox2: () => (
    <Checkbox defaultSelected aria-label="Accept terms">
      <CheckboxControl />
      <Label>Accept terms</Label>
    </Checkbox>
  ),
  badges: () => (
    <div className="flex gap-1.5">
      <Badge>New</Badge>
      <Badge appearance="outline">Beta</Badge>
      <Badge variant="success" appearance="soft">
        Live
      </Badge>
    </div>
  ),
  avatars: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>ML</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
  kbd: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
  kbd2: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
  toggle: (tick) => (
    <ToggleButton isSelected={tick % 2 === 1} aria-label="Pin">
      <PinIcon data-icon="inline-start" className="rotate-45" />
      Pin
    </ToggleButton>
  ),
  like: () => (
    <ToggleButton defaultSelected isIconOnly aria-label="Like">
      <HeartIcon />
    </ToggleButton>
  ),
  format: () => (
    <ToggleButtonGroup
      aria-label="Text formatting"
      selectionMode="multiple"
      defaultSelectedKeys={["bold"]}
    >
      <ToggleButton id="bold" isIconOnly aria-label="Bold">
        <BoldIcon />
      </ToggleButton>
      <ToggleButton id="italic" isIconOnly aria-label="Italic">
        <ItalicIcon />
      </ToggleButton>
      <ToggleButton id="underline" isIconOnly aria-label="Underline">
        <UnderlineIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  ),
  loader: () => (
    <div className="flex items-center gap-2 text-sm text-fg-muted">
      <Loader />
      Loading…
    </div>
  ),
  tabs: (tick) => (
    <Tabs selectedKey={["overview", "analytics", "reports"][tick % 3]}>
      <TabList aria-label="Sections">
        <Tab id="overview">Overview</Tab>
        <Tab id="analytics">Analytics</Tab>
        <Tab id="reports">Reports</Tab>
      </TabList>
    </Tabs>
  ),
  segmented: (tick) => (
    <SegmentedControl
      selectedKeys={[["day", "week", "month"][(tick + 1) % 3]!]}
      aria-label="Range"
    >
      <SegmentedControlItem id="day">Day</SegmentedControlItem>
      <SegmentedControlItem id="week">Week</SegmentedControlItem>
      <SegmentedControlItem id="month">Month</SegmentedControlItem>
    </SegmentedControl>
  ),
  view: () => (
    <SegmentedControl defaultSelectedKeys={["grid"]} aria-label="View">
      <SegmentedControlItem id="grid">
        <LayoutGridIcon />
        Grid
      </SegmentedControlItem>
      <SegmentedControlItem id="list">
        <ListIcon />
        List
      </SegmentedControlItem>
    </SegmentedControl>
  ),
  email: () => (
    <TextField className="w-60" defaultValue="hello@acme.dev">
      <Label>Email</Label>
      <Input />
    </TextField>
  ),
  password: () => (
    <TextField className="w-60">
      <Label>Name</Label>
      <Input placeholder="Jane Cooper" />
      <Description>Shown on your profile.</Description>
    </TextField>
  ),
  select: () => (
    <Select className="w-60" defaultSelectedKey="pro">
      <Label>Plan</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="free">Free</SelectItem>
        <SelectItem id="pro">Pro</SelectItem>
        <SelectItem id="team">Team</SelectItem>
      </SelectContent>
    </Select>
  ),
  timezone: () => (
    <Select className="w-60" defaultSelectedKey="utc">
      <Label>Timezone</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="utc">UTC+01:00 Paris</SelectItem>
        <SelectItem id="ny">UTC−05:00 New York</SelectItem>
      </SelectContent>
    </Select>
  ),
  slider: (tick) => (
    <Slider className="w-60" value={[40, 64, 52, 76][tick % 4]}>
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <SliderOutput />
      </div>
      <SliderControl />
    </Slider>
  ),
  range: () => (
    <Slider
      className="w-60"
      defaultValue={[200, 360]}
      minValue={100}
      maxValue={500}
    >
      <div className="flex items-center justify-between">
        <Label>Price</Label>
        <SliderOutput />
      </div>
      <SliderControl />
    </Slider>
  ),
  progress: (tick) => (
    <ProgressBar className="w-60" value={Math.min(100, 28 + tick * 9)}>
      <div className="flex items-center justify-between gap-2">
        <Label>Uploading</Label>
        <ProgressBarOutput />
      </div>
      <ProgressBarControl />
    </ProgressBar>
  ),
  search: () => (
    <SearchField className="w-60" aria-label="Search">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input placeholder="Search…" />
        <InputGroupAddon>
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  ),
  subscribe: () => (
    <TextField className="w-72" aria-label="Email">
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <Input placeholder="you@example.com" />
      </InputGroup>
    </TextField>
  ),
  number: () => (
    <NumberField className="w-44" defaultValue={2}>
      <Label>Seats</Label>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <Input />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  ),
  tags: () => (
    <TagGroup selectionMode="single" defaultSelectedKeys={["design"]}>
      <Label>Topics</Label>
      <TagList>
        <Tag id="design">Design</Tag>
        <Tag id="eng">Engineering</Tag>
        <Tag id="ops">Ops</Tag>
      </TagList>
    </TagGroup>
  ),
  list: () => (
    <div className="size-full p-2">
      <ListBox
        aria-label="Status"
        selectionMode="single"
        defaultSelectedKeys={["progress"]}
      >
        <ListBoxItem id="backlog">Backlog</ListBoxItem>
        <ListBoxItem id="todo">Todo</ListBoxItem>
        <ListBoxItem id="progress">In progress</ListBoxItem>
        <ListBoxItem id="done">Done</ListBoxItem>
        <ListBoxItem id="canceled">Canceled</ListBoxItem>
      </ListBox>
    </div>
  ),
  calendar: () => (
    <Calendar aria-label="Date" defaultValue={DAY} defaultFocusedValue={DAY}>
      <CalendarHeader>
        <Button slot="previous" variant="quiet" isIconOnly>
          <ChevronLeftIcon />
        </Button>
        <CalendarHeading />
        <Button slot="next" variant="quiet" isIconOnly>
          <ChevronRightIcon />
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  ),
  card: () => (
    <Card className="size-full justify-center">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <TextField className="w-full" defaultValue="my-app">
          <Label>Name</Label>
          <Input />
        </TextField>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Cancel</Button>
        <Button variant="primary">Deploy</Button>
      </CardFooter>
    </Card>
  ),
  notify: () => (
    <Button>
      <BellIcon data-icon="inline-start" />
      Notify me
    </Button>
  ),
  upload: () => (
    <Button variant="primary">
      <UploadIcon data-icon="inline-start" />
      Upload
    </Button>
  ),
  ai: () => (
    <Button>
      <SparklesIcon data-icon="inline-start" />
      Generate
    </Button>
  ),
  avatar: () => (
    <div className="flex items-center gap-3">
      <Avatar size="lg">
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-fg">Jane Cooper</span>
        <span className="text-xs text-fg-muted">jane@acme.dev</span>
      </div>
    </div>
  ),
  alert: () => (
    <Alert className="w-[26rem]">
      <InfoIcon />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>Version 2.4 is ready to install.</AlertDescription>
    </Alert>
  ),
  date: () => (
    <DateField className="w-60" defaultValue={DAY}>
      <Label>Due date</Label>
      <DateInput />
    </DateField>
  ),
  otp: () => (
    <OTPField length={6} defaultValue="2849">
      <Label>Verification code</Label>
      <div className="flex items-center">
        <OTPFieldGroup>
          <Input aria-label="Digit 1" />
          <Input aria-label="Digit 2" />
          <Input aria-label="Digit 3" />
        </OTPFieldGroup>
        <OTPFieldSeparator className="px-2 text-fg-muted">-</OTPFieldSeparator>
        <OTPFieldGroup>
          <Input aria-label="Digit 4" />
          <Input aria-label="Digit 5" />
          <Input aria-label="Digit 6" />
        </OTPFieldGroup>
      </div>
    </OTPField>
  ),
  breadcrumbs: () => (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink>Home</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Projects</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink>Settings</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
  status: () => (
    <div className="flex gap-1.5">
      <Badge variant="accent">Active</Badge>
      <Badge variant="warning" appearance="soft">
        Pending
      </Badge>
    </div>
  ),
}

/** One cell's content; re-renders only when its beat tick changes. */
export const TileContent = memo(function TileContent({
  kind,
  tick,
}: {
  kind: string
  tick: number
}) {
  return <>{TILES[kind]!(tick)}</>
})

/** Kinds that paint their own surface (no cell chrome). */
export const BARE = new Set(["card"])

/** Kinds whose content changes on the beat. */
export const LIVE = new Set([
  "switch",
  "switch2",
  "checkbox",
  "toggle",
  "tabs",
  "segmented",
  "slider",
  "progress",
])
