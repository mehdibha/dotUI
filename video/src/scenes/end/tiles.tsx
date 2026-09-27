import type { ReactNode } from "react"

import { BoldIcon, ItalicIcon, MailIcon, UnderlineIcon } from "@/registry/icons"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
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
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { CustomDomain } from "@/components/showcase/custom-domain"
import { EmptyState } from "@/components/showcase/empty-state"
import { LoginForm } from "@/components/showcase/login-form"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"

/* The film's cast, one last time: real components and landing cards that the
   vortex pulls into the dot. */

function Chip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-fg shadow-lg">
      {children}
    </div>
  )
}

export const SMALL: Record<string, () => ReactNode> = {
  buttons: () => (
    <Chip>
      <Button variant="primary">Get started</Button>
      <Button>Learn more</Button>
    </Chip>
  ),
  switch: () => (
    <Chip>
      <Switch defaultSelected className="gap-3">
        <SwitchControl />
        <Label>Notifications</Label>
      </Switch>
    </Chip>
  ),
  checkbox: () => (
    <Chip>
      <Checkbox defaultSelected>Remember me</Checkbox>
    </Chip>
  ),
  badges: () => (
    <Chip>
      <Badge variant="accent">New</Badge>
      <Badge variant="success" appearance="soft">
        Live
      </Badge>
      <Badge appearance="outline">Beta</Badge>
    </Chip>
  ),
  avatars: () => (
    <Chip>
      <div className="flex -space-x-2">
        {["AL", "GH", "AT", "KJ"].map((n) => (
          <Avatar key={n} className="ring-2 ring-card">
            <AvatarFallback>{n}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm text-fg-muted">+12</span>
    </Chip>
  ),
  slider: () => (
    <Chip>
      <Slider aria-label="Volume" defaultValue={64} className="w-52">
        <SliderControl />
      </Slider>
    </Chip>
  ),
  segmented: () => (
    <Chip>
      <SegmentedControl aria-label="Range" defaultSelectedKeys={["week"]}>
        <SegmentedControlItem id="day">Day</SegmentedControlItem>
        <SegmentedControlItem id="week">Week</SegmentedControlItem>
        <SegmentedControlItem id="month">Month</SegmentedControlItem>
      </SegmentedControl>
    </Chip>
  ),
  tabs: () => (
    <Chip>
      <Tabs defaultSelectedKey="overview">
        <TabList aria-label="Sections">
          <Tab id="overview">Overview</Tab>
          <Tab id="activity">Activity</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>
      </Tabs>
    </Chip>
  ),
  email: () => (
    <Chip>
      <TextField
        aria-label="Email"
        defaultValue="ada@acme.dev"
        className="w-60"
      >
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input />
        </InputGroup>
      </TextField>
    </Chip>
  ),
  progress: () => (
    <Chip>
      <ProgressBar aria-label="Upload" value={72} className="w-56">
        <div className="flex items-center justify-between gap-2">
          <Label>Uploading</Label>
          <ProgressBarOutput />
        </div>
        <ProgressBarControl>
          <ProgressBarFill />
        </ProgressBarControl>
      </ProgressBar>
    </Chip>
  ),
  tags: () => (
    <Chip>
      <TagGroup
        aria-label="Topics"
        selectionMode="multiple"
        defaultSelectedKeys={["design", "a11y"]}
      >
        <TagList>
          <Tag id="design">Design</Tag>
          <Tag id="motion">Motion</Tag>
          <Tag id="a11y">Accessible</Tag>
        </TagList>
      </TagGroup>
    </Chip>
  ),
  kbd: () => (
    <Chip>
      <span className="text-sm text-fg-muted">Search</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Chip>
  ),
  radio: () => (
    <Chip>
      <RadioGroup
        aria-label="Plan"
        defaultValue="pro"
        orientation="horizontal"
        className="flex gap-4"
      >
        <Radio value="free">
          <RadioControl>
            <RadioIndicator />
            <Label>Free</Label>
          </RadioControl>
        </Radio>
        <Radio value="pro">
          <RadioControl>
            <RadioIndicator />
            <Label>Pro</Label>
          </RadioControl>
        </Radio>
      </RadioGroup>
    </Chip>
  ),
  toggles: () => (
    <Chip>
      <ToggleButton aria-label="Bold" defaultSelected>
        <BoldIcon />
      </ToggleButton>
      <ToggleButton aria-label="Italic">
        <ItalicIcon />
      </ToggleButton>
      <ToggleButton aria-label="Underline">
        <UnderlineIcon />
      </ToggleButton>
    </Chip>
  ),
}

export const LARGE: Record<string, () => ReactNode> = {
  team: () => <TeamName className="w-[380px]" />,
  twoFactor: () => <TwoFactor className="w-[360px]" />,
  login: () => <LoginForm className="w-[340px] max-w-none" />,
  cookies: () => <CookiePreferences className="w-[380px]" />,
  domain: () => <CustomDomain className="w-[380px]" />,
  empty: () => <EmptyState className="w-[340px]" />,
  approval: () => <ApprovalPrompt className="w-[380px]" />,
}
