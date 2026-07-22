'use client'

import type { ReactNode } from 'react'
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
  XIcon,
} from 'lucide-react'

import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Card } from '@/registry/ui/card'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Command } from '@/registry/ui/command'
import { Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { SearchField } from '@/registry/ui/search-field'
import { Separator } from '@/registry/ui/separator'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

/**
 * A live, static spread per audited component — the widest representative slice
 * that renders without interaction. Themed by the scoped provider the page
 * wraps each one in.
 */
export const componentRenders: Record<string, () => ReactNode> = {
  button: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="default">Secondary</Button>
        <Button variant="danger">Destructive</Button>
        <Button variant="quiet">Quiet</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="xs">
          Extra small
        </Button>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>
    </div>
  ),

  input: () => <Input className="max-w-xs" placeholder="Enter text..." />,

  tabs: () => (
    <Tabs>
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="usage">Usage</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanel id="overview">Overview content</TabPanel>
      <TabPanel id="usage">Usage content</TabPanel>
      <TabPanel id="settings">Settings content</TabPanel>
    </Tabs>
  ),

  switch: () => (
    <div className="flex flex-col gap-3">
      <Switch>
        <SwitchControl />
        <Label>Off</Label>
      </Switch>
      <Switch defaultSelected>
        <SwitchControl />
        <Label>On</Label>
      </Switch>
    </div>
  ),

  badge: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="accent">accent</Badge>
        <Badge variant="success">success</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="danger">danger</Badge>
        <Badge variant="info">info</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral" appearance="subtle">
          neutral
        </Badge>
        <Badge variant="accent" appearance="subtle">
          accent
        </Badge>
        <Badge variant="success" appearance="subtle">
          success
        </Badge>
      </div>
    </div>
  ),

  checkbox: () => (
    <div className="flex flex-col gap-3">
      <Checkbox>
        <CheckboxControl />
        <Label>Unchecked</Label>
      </Checkbox>
      <Checkbox defaultSelected>
        <CheckboxControl />
        <Label>Checked</Label>
      </Checkbox>
    </div>
  ),

  tooltip: () => (
    <Tooltip>
      <Button variant="default">Hover me</Button>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  ),

  command: () => (
    <Card className="w-full p-0">
      <Command aria-label="Command menu">
        <SearchField aria-label="Search">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Type a command or search..." />
            <InputGroupAddon className="[--addon-button-inset:--spacing(2)]">
              <Button isIconOnly variant="quiet">
                <XIcon aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </SearchField>
        <ListBox aria-label="Commands">
          <ListBoxSection>
            <ListBoxSectionHeader>Suggestions</ListBoxSectionHeader>
            <ListBoxItem textValue="Calendar">
              <CalendarIcon />
              <span>Calendar</span>
            </ListBoxItem>
            <ListBoxItem textValue="Search Emoji">
              <SmileIcon />
              <span>Search Emoji</span>
            </ListBoxItem>
            <ListBoxItem textValue="Calculator">
              <CalculatorIcon />
              <span>Calculator</span>
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxSection>
            <ListBoxSectionHeader>Settings</ListBoxSectionHeader>
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
            <ListBoxItem textValue="Settings">
              <SettingsIcon />
              <span>Settings</span>
              <Kbd>⌘S</Kbd>
            </ListBoxItem>
          </ListBoxSection>
        </ListBox>
      </Command>
    </Card>
  ),
}

/** Captions shown beneath the live cell (outside the themed canvas) for renders
 *  whose full behavior can't be judged from a static frame. */
export const renderCaptions: Record<string, string> = {
  input: 'Focus ring needs an interactive audit.',
  tooltip: 'Overlay only mounts on hover/focus — needs an interactive audit.',
}
