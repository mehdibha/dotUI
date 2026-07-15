import 'shiki-magic-move/style.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { parseDate } from '@internationalized/date'
import { diffCleanupSemanticLossless } from 'diff-match-patch-es'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import { useTheme } from 'starter-themes'

import {
  CalendarIcon,
  ChevronDownIcon,
  MailIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import { Calendar, RangeCalendar } from '@/registry/ui/calendar'
import { Combobox } from '@/registry/ui/combobox'
import { Command } from '@/registry/ui/command'
import { ContextMenu } from '@/registry/ui/context-menu'
import { DateField } from '@/registry/ui/date-field'
import { DatePicker, DateRangePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Drawer } from '@/registry/ui/drawer'
import { Description, Label } from '@/registry/ui/field'
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Mention } from '@/registry/ui/mention'
import { Menu, MenuContent, MenuItem, MenuSub } from '@/registry/ui/menu'
import { Modal } from '@/registry/ui/modal'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectTrigger } from '@/registry/ui/select'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'
import { TextField } from '@/registry/ui/text-field'
import { highlighter } from '@/modules/docs/highlight'

interface Step {
  title: string
  // How long the step stays on screen — proportional to how much the diff
  // asks the reader to take in, not to total snippet length.
  durationMs: number
  code: string
  preview: React.ReactNode
  // Short transitional beat that plays during auto-advance but isn't a
  // clickable stop in the pagination (e.g. building an InputGroup addon by
  // addon before landing on the headline step).
  mid?: boolean
}

const firstStep: Step = {
  title: 'Input',
  durationMs: 2400,
  code: `<Input placeholder="hello@example.com" />`,
  preview: (
    <Input
      aria-label="Email"
      placeholder="hello@example.com"
      className="w-56 [view-transition-name:cmp-field]"
    />
  ),
}

const steps: Step[] = [
  firstStep,
  {
    title: 'TextField',
    durationMs: 2600,
    code: `<TextField>
  <Input placeholder="hello@example.com" />
</TextField>`,
    preview: (
      <TextField aria-label="Email" className="w-56">
        <Input
          placeholder="hello@example.com"
          className="[view-transition-name:cmp-field]"
        />
      </TextField>
    ),
  },
  {
    title: 'Label & Description',
    durationMs: 3000,
    code: `<TextField>
  <Label>Email</Label>
  <Input placeholder="hello@example.com" />
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-56">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <Input
          placeholder="hello@example.com"
          className="[view-transition-name:cmp-field]"
        />
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Mid beat: wrap the input in an InputGroup — no addons yet.
    title: 'InputGroup',
    mid: true,
    durationMs: 1400,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <Input placeholder="hello@example.com" />
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <Input placeholder="hello@example.com" />
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Mid beat: add the leading addon.
    title: 'InputGroup',
    mid: true,
    durationMs: 1400,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="hello@example.com" />
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="hello@example.com" />
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Headline step: add the trailing addon — the full InputGroup.
    title: 'InputGroup',
    durationMs: 3600,
    code: `<TextField>
  <Label>Email</Label>
  <InputGroup>
    <InputGroupAddon>
      <MailIcon />
    </InputGroupAddon>
    <Input placeholder="hello@example.com" />
    <InputGroupAddon>
      <Button size="sm">Subscribe</Button>
    </InputGroupAddon>
  </InputGroup>
  <Description>No spam, unsubscribe anytime.</Description>
</TextField>`,
    preview: (
      <TextField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Email</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <Input placeholder="hello@example.com" />
          <InputGroupAddon>
            <Button size="sm" className="[view-transition-name:cmp-trigger]">
              Subscribe
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Description className="[view-transition-name:cmp-desc]">
          No spam, unsubscribe anytime.
        </Description>
      </TextField>
    ),
  },
  {
    // Same anatomy, different field: swap in SearchField, a search icon, and a
    // ⌘K hint that reappears in the command palette finale.
    title: 'SearchField',
    durationMs: 2800,
    code: `<SearchField>
  <Label>Search</Label>
  <InputGroup>
    <InputGroupAddon>
      <SearchIcon />
    </InputGroupAddon>
    <Input placeholder="Search docs…" />
    <InputGroupAddon>
      <Kbd>⌘K</Kbd>
    </InputGroupAddon>
  </InputGroup>
</SearchField>`,
    preview: (
      <SearchField className="w-72">
        <Label className="[view-transition-name:cmp-label]">Search</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Search docs…" />
          <InputGroupAddon>
            <Kbd className="[view-transition-name:cmp-kbd]">⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </SearchField>
    ),
  },
  {
    title: 'DateField',
    durationMs: 3000,
    code: `<DateField>
  <Label>Meeting date</Label>
  <InputGroup>
    <InputGroupAddon>
      <CalendarIcon />
    </InputGroupAddon>
    <DateInput />
  </InputGroup>
</DateField>`,
    preview: (
      <DateField className="w-56" defaultValue={parseDate('2026-07-10')}>
        <Label className="[view-transition-name:cmp-label]">Meeting date</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <InputGroupAddon>
            <CalendarIcon />
          </InputGroupAddon>
          <DateInput />
        </InputGroup>
      </DateField>
    ),
  },
  {
    // Mid beat: promote to DatePicker — move the icon to a trailing trigger,
    // still no popover.
    title: 'DatePicker',
    mid: true,
    durationMs: 1400,
    code: `<DatePicker>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
</DatePicker>`,
    preview: (
      <DatePicker className="w-56" defaultValue={parseDate('2026-07-10')}>
        <Label className="[view-transition-name:cmp-label]">Meeting date</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </DatePicker>
    ),
  },
  {
    // Headline: attach the popover calendar.
    title: 'DatePicker',
    durationMs: 3400,
    code: `<DatePicker>
  <Label>Meeting date</Label>
  <InputGroup>
    <DateInput />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <Calendar />
    </DialogContent>
  </Popover>
</DatePicker>`,
    preview: (
      <DatePicker className="w-56" defaultValue={parseDate('2026-07-10')}>
        <Label className="[view-transition-name:cmp-label]">Meeting date</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <Calendar />
          </DialogContent>
        </Popover>
      </DatePicker>
    ),
  },
  {
    title: 'DateRangePicker',
    durationMs: 3400,
    code: `<DateRangePicker>
  <Label>Trip dates</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Popover>
</DateRangePicker>`,
    preview: (
      <DateRangePicker
        className="w-64"
        defaultValue={{
          start: parseDate('2026-07-10'),
          end: parseDate('2026-07-17'),
        }}
      >
        <Label className="[view-transition-name:cmp-label]">Trip dates</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Popover>
      </DateRangePicker>
    ),
  },
  {
    // Mid beat: swap the overlay primitive — one word, Popover → Modal.
    title: 'Modal',
    mid: true,
    durationMs: 1300,
    code: `<DateRangePicker>
  <Label>Trip dates</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Modal>
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Modal>
</DateRangePicker>`,
    preview: (
      <DateRangePicker
        className="w-64"
        defaultValue={{
          start: parseDate('2026-07-10'),
          end: parseDate('2026-07-17'),
        }}
      >
        <Label className="[view-transition-name:cmp-label]">Trip dates</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Modal>
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Modal>
      </DateRangePicker>
    ),
  },
  {
    title: 'Drawer',
    durationMs: 2800,
    code: `<DateRangePicker>
  <Label>Trip dates</Label>
  <InputGroup>
    <DateInput slot="start" />
    <span>–</span>
    <DateInput slot="end" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <CalendarIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Drawer placement="bottom">
    <DialogContent>
      <RangeCalendar />
    </DialogContent>
  </Drawer>
</DateRangePicker>`,
    preview: (
      <DateRangePicker
        className="w-64"
        defaultValue={{
          start: parseDate('2026-07-10'),
          end: parseDate('2026-07-17'),
        }}
      >
        <Label className="[view-transition-name:cmp-label]">Trip dates</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Drawer placement="bottom">
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Drawer>
      </DateRangePicker>
    ),
  },
  {
    // Mid beat: collapse to a bare Select — label and trigger only.
    title: 'Select',
    mid: true,
    durationMs: 1300,
    code: `<Select>
  <Label>Assignee</Label>
  <SelectTrigger />
</Select>`,
    preview: (
      <Select className="w-56">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-trigger]" />
      </Select>
    ),
  },
  {
    // Headline: attach the options list.
    title: 'Select',
    durationMs: 3200,
    code: `<Select>
  <Label>Assignee</Label>
  <SelectTrigger />
  <Popover>
    <ListBox>
      <ListBoxItem>Cara</ListBoxItem>
      <ListBoxItem>Dan</ListBoxItem>
      <ListBoxItem>Eve</ListBoxItem>
    </ListBox>
  </Popover>
</Select>`,
    preview: (
      <Select className="w-56" defaultSelectedKey="cara">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-trigger]" />
        <Popover>
          <ListBox className="[view-transition-name:cmp-list]">
            <ListBoxItem id="cara">Cara</ListBoxItem>
            <ListBoxItem id="dan">Dan</ListBoxItem>
            <ListBoxItem id="eve">Eve</ListBoxItem>
          </ListBox>
        </Popover>
      </Select>
    ),
  },
  {
    // Mid beat: the same list gains a section header.
    title: 'Sections',
    mid: true,
    durationMs: 1400,
    code: `<Select>
  <Label>Assignee</Label>
  <SelectTrigger />
  <Popover>
    <ListBox>
      <ListBoxSection>
        <ListBoxSectionHeader>Team</ListBoxSectionHeader>
        <ListBoxItem>Cara</ListBoxItem>
        <ListBoxItem>Dan</ListBoxItem>
        <ListBoxItem>Eve</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  </Popover>
</Select>`,
    preview: (
      <Select className="w-56" defaultSelectedKey="cara">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-trigger]" />
        <Popover>
          <ListBox className="[view-transition-name:cmp-list]">
            <ListBoxSection>
              <ListBoxSectionHeader>Team</ListBoxSectionHeader>
              <ListBoxItem id="cara">Cara</ListBoxItem>
              <ListBoxItem id="dan">Dan</ListBoxItem>
              <ListBoxItem id="eve">Eve</ListBoxItem>
            </ListBoxSection>
          </ListBox>
        </Popover>
      </Select>
    ),
  },
  {
    // Headline: same list, now a typeahead — swap the trigger for an input.
    title: 'Combobox',
    durationMs: 3200,
    code: `<Combobox>
  <Label>Assignee</Label>
  <InputGroup>
    <Input placeholder="Search people…" />
    <InputGroupAddon>
      <Button size="sm" isIconOnly>
        <ChevronDownIcon />
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>Cara</ListBoxItem>
      <ListBoxItem>Dan</ListBoxItem>
      <ListBoxItem>Eve</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>`,
    preview: (
      <Combobox className="w-64">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <InputGroup className="[view-transition-name:cmp-field]">
          <Input placeholder="Search people…" />
          <InputGroupAddon>
            <Button
              size="sm"
              isIconOnly
              className="[view-transition-name:cmp-trigger]"
            >
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <ListBox className="[view-transition-name:cmp-list]">
            <ListBoxItem id="cara">Cara</ListBoxItem>
            <ListBoxItem id="dan">Dan</ListBoxItem>
            <ListBoxItem id="eve">Eve</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
    ),
  },
  {
    // Headline: multi-select — selected people surface as tags.
    title: 'Tags',
    durationMs: 3000,
    code: `<Combobox>
  <Label>Assignee</Label>
  <TagGroup>
    <TagList>
      <Tag>Ana</Tag>
      <Tag>Ben</Tag>
    </TagList>
  </TagGroup>
  <InputGroup>
    <Input placeholder="Add people…" />
  </InputGroup>
  <Popover>
    <ListBox>
      <ListBoxItem>Cara</ListBoxItem>
      <ListBoxItem>Dan</ListBoxItem>
      <ListBoxItem>Eve</ListBoxItem>
    </ListBox>
  </Popover>
</Combobox>`,
    preview: (
      <Combobox className="w-64">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <TagGroup aria-label="Invitees">
          <TagList>
            <Tag>Ana</Tag>
            <Tag>Ben</Tag>
          </TagList>
        </TagGroup>
        <InputGroup className="[view-transition-name:cmp-field]">
          <Input placeholder="Add people…" />
        </InputGroup>
        <Popover>
          <ListBox className="[view-transition-name:cmp-list]">
            <ListBoxItem id="cara">Cara</ListBoxItem>
            <ListBoxItem id="dan">Dan</ListBoxItem>
            <ListBoxItem id="eve">Eve</ListBoxItem>
          </ListBox>
        </Popover>
      </Combobox>
    ),
  },
  {
    // Mid beat: a plain menu off an icon button.
    title: 'Menu',
    mid: true,
    durationMs: 1400,
    code: `<Menu>
  <Button size="sm" isIconOnly>
    <MoreHorizontalIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Delete</MenuItem>
    </MenuContent>
  </Popover>
</Menu>`,
    preview: (
      <Menu>
        <Button
          size="sm"
          isIconOnly
          aria-label="Actions"
          className="[view-transition-name:cmp-trigger]"
        >
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            <MenuItem>Edit</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    ),
  },
  {
    // Headline: the items gain keyboard shortcuts.
    title: 'Menu',
    durationMs: 2800,
    code: `<Menu>
  <Button size="sm" isIconOnly>
    <MoreHorizontalIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Edit <Kbd>⌘E</Kbd></MenuItem>
      <MenuItem>Duplicate <Kbd>⌘D</Kbd></MenuItem>
      <MenuItem>Delete <Kbd>⌘⌫</Kbd></MenuItem>
    </MenuContent>
  </Popover>
</Menu>`,
    preview: (
      <Menu>
        <Button
          size="sm"
          isIconOnly
          aria-label="Actions"
          className="[view-transition-name:cmp-trigger]"
        >
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            <MenuItem textValue="Edit">
              Edit
              <Kbd>⌘E</Kbd>
            </MenuItem>
            <MenuItem textValue="Duplicate">
              Duplicate
              <Kbd>⌘D</Kbd>
            </MenuItem>
            <MenuItem textValue="Delete">
              Delete
              <Kbd>⌘⌫</Kbd>
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    ),
  },
  {
    // Mid beat: one item nests a submenu.
    title: 'Submenu',
    mid: true,
    durationMs: 1500,
    code: `<Menu>
  <Button size="sm" isIconOnly>
    <MoreHorizontalIcon />
  </Button>
  <Popover>
    <MenuContent>
      <MenuItem>Edit <Kbd>⌘E</Kbd></MenuItem>
      <MenuSub>
        <MenuItem>Move to</MenuItem>
        <Popover>
          <MenuContent>
            <MenuItem>Project</MenuItem>
            <MenuItem>Team</MenuItem>
          </MenuContent>
        </Popover>
      </MenuSub>
      <MenuItem>Delete <Kbd>⌘⌫</Kbd></MenuItem>
    </MenuContent>
  </Popover>
</Menu>`,
    preview: (
      <Menu>
        <Button
          size="sm"
          isIconOnly
          aria-label="Actions"
          className="[view-transition-name:cmp-trigger]"
        >
          <MoreHorizontalIcon />
        </Button>
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            <MenuItem textValue="Edit">
              Edit
              <Kbd>⌘E</Kbd>
            </MenuItem>
            <MenuSub>
              <MenuItem>Move to</MenuItem>
              <Popover>
                <MenuContent>
                  <MenuItem>Project</MenuItem>
                  <MenuItem>Team</MenuItem>
                </MenuContent>
              </Popover>
            </MenuSub>
            <MenuItem textValue="Delete">
              Delete
              <Kbd>⌘⌫</Kbd>
            </MenuItem>
          </MenuContent>
        </Popover>
      </Menu>
    ),
  },
  {
    // Headline: the same menu, now opened by right-click — the trigger becomes
    // the target surface.
    title: 'ContextMenu',
    durationMs: 3000,
    code: `<ContextMenu>
  Right click here
  <Popover>
    <MenuContent>
      <MenuItem>Edit <Kbd>⌘E</Kbd></MenuItem>
      <MenuItem>Duplicate <Kbd>⌘D</Kbd></MenuItem>
      <MenuItem>Delete <Kbd>⌘⌫</Kbd></MenuItem>
    </MenuContent>
  </Popover>
</ContextMenu>`,
    preview: (
      <ContextMenu className="bg-bg-muted flex h-24 w-64 items-center justify-center rounded-md border border-dashed text-sm text-fg-muted">
        Right click here
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            <MenuItem textValue="Edit">
              Edit
              <Kbd>⌘E</Kbd>
            </MenuItem>
            <MenuItem textValue="Duplicate">
              Duplicate
              <Kbd>⌘D</Kbd>
            </MenuItem>
            <MenuItem textValue="Delete">
              Delete
              <Kbd>⌘⌫</Kbd>
            </MenuItem>
          </MenuContent>
        </Popover>
      </ContextMenu>
    ),
  },
  {
    // Mid beat: the same menu, filtered by an @-mention typed into a textarea.
    title: 'Mention',
    mid: true,
    durationMs: 1500,
    code: `<Mention>
  <TextField>
    <Label>Comment</Label>
    <TextArea placeholder="Type @ to mention…" />
  </TextField>
  <Popover>
    <MenuContent>
      <MenuItem>Alex Miller</MenuItem>
      <MenuItem>Sarah Jones</MenuItem>
    </MenuContent>
  </Popover>
</Mention>`,
    preview: (
      <Mention className="w-64">
        <TextField>
          <Label className="[view-transition-name:cmp-label]">Comment</Label>
          <TextArea placeholder="Type @ to mention…" />
        </TextField>
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            {/* Ids are the full names — Mention inserts String(key) on select. */}
            <MenuItem id="Alex Miller">Alex Miller</MenuItem>
            <MenuItem id="Sarah Jones">Sarah Jones</MenuItem>
          </MenuContent>
        </Popover>
      </Mention>
    ),
  },
  {
    // Headline: each suggestion gains an avatar.
    title: 'Mention',
    durationMs: 3200,
    code: `<Mention>
  <TextField>
    <Label>Comment</Label>
    <TextArea placeholder="Type @ to mention…" />
  </TextField>
  <Popover>
    <MenuContent>
      <MenuItem>
        <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
        Alex Miller
      </MenuItem>
      <MenuItem>
        <Avatar><AvatarFallback>S</AvatarFallback></Avatar>
        Sarah Jones
      </MenuItem>
    </MenuContent>
  </Popover>
</Mention>`,
    preview: (
      <Mention className="w-64">
        <TextField>
          <Label className="[view-transition-name:cmp-label]">Comment</Label>
          <TextArea placeholder="Type @ to mention…" />
        </TextField>
        <Popover>
          <MenuContent className="[view-transition-name:cmp-list]">
            <MenuItem id="Alex Miller" textValue="Alex Miller">
              <Avatar size="sm">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              Alex Miller
            </MenuItem>
            <MenuItem id="Sarah Jones" textValue="Sarah Jones">
              <Avatar size="sm">
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              Sarah Jones
            </MenuItem>
          </MenuContent>
        </Popover>
      </Mention>
    ),
  },
  {
    // Mid beat: the command palette skeleton — a search input inside Command.
    title: 'Command',
    mid: true,
    durationMs: 1400,
    code: `<Command>
  <SearchField>
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Type a command…" />
    </InputGroup>
  </SearchField>
</Command>`,
    preview: (
      <div className="w-72 overflow-hidden rounded-md border bg-bg">
        <Command aria-label="Command menu">
          <SearchField aria-label="Search">
            <InputGroup className="[view-transition-name:cmp-field]">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Type a command…" />
            </InputGroup>
          </SearchField>
        </Command>
      </div>
    ),
  },
  {
    // Mid beat: the palette gains its list of commands.
    title: 'Command',
    mid: true,
    durationMs: 1500,
    code: `<Command>
  <SearchField>
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Type a command…" />
    </InputGroup>
  </SearchField>
  <ListBox>
    <ListBoxItem>New issue</ListBoxItem>
    <ListBoxItem>Assign to…</ListBoxItem>
    <ListBoxItem>Search docs</ListBoxItem>
  </ListBox>
</Command>`,
    preview: (
      <div className="w-72 overflow-hidden rounded-md border bg-bg">
        <Command aria-label="Command menu">
          <SearchField aria-label="Search">
            <InputGroup className="[view-transition-name:cmp-field]">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Type a command…" />
            </InputGroup>
          </SearchField>
          <ListBox
            aria-label="Commands"
            className="[view-transition-name:cmp-list]"
          >
            <ListBoxItem id="new-issue">New issue</ListBoxItem>
            <ListBoxItem id="assign">Assign to…</ListBoxItem>
            <ListBoxItem id="search-docs">Search docs</ListBoxItem>
          </ListBox>
        </Command>
      </div>
    ),
  },
  {
    // The finale: every part recomposed into a live command palette — sectioned,
    // shortcut-hinted, and typing filters it in place.
    title: 'Command palette',
    durationMs: 4200,
    code: `<Command>
  <SearchField>
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <Input placeholder="Type a command…" />
    </InputGroup>
  </SearchField>
  <ListBox>
    <ListBoxSection>
      <ListBoxSectionHeader>Actions</ListBoxSectionHeader>
      <ListBoxItem>New issue <Kbd>⌘N</Kbd></ListBoxItem>
      <ListBoxItem>Assign to…</ListBoxItem>
      <ListBoxItem>Search docs <Kbd>⌘K</Kbd></ListBoxItem>
    </ListBoxSection>
  </ListBox>
</Command>`,
    preview: (
      <div className="w-72 overflow-hidden rounded-md border bg-bg">
        <Command aria-label="Command menu">
          <SearchField aria-label="Search">
            <InputGroup className="[view-transition-name:cmp-field]">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Type a command…" />
            </InputGroup>
          </SearchField>
          <ListBox
            aria-label="Commands"
            className="[view-transition-name:cmp-list]"
          >
            <ListBoxSection>
              <ListBoxSectionHeader>Actions</ListBoxSectionHeader>
              <ListBoxItem id="new-issue" textValue="New issue">
                New issue
                <Kbd>⌘N</Kbd>
              </ListBoxItem>
              <ListBoxItem id="assign">Assign to…</ListBoxItem>
              <ListBoxItem id="search-docs" textValue="Search docs">
                Search docs
                <Kbd className="[view-transition-name:cmp-kbd]">⌘K</Kbd>
              </ListBoxItem>
            </ListBoxSection>
          </ListBox>
        </Command>
      </div>
    ),
  },
]

// Pagination lists only the headline steps; mid steps play during auto-advance
// but aren't clickable stops. Each entry keeps its index into `steps` so the
// rail/dots can jump straight to it.
const paginatedSteps = steps
  .map((s, index) => ({ title: s.title, index, mid: s.mid }))
  .filter((s) => !s.mid)

export type CompositionPlayer = ReturnType<typeof useCompositionPlayer>

// Shared player: auto-advance while visible, with a CSS animation as the step
// clock (see StepTimer) so the visible progress and the advance tick can never
// drift. Hovering or focusing the showcase pauses; the play/pause button is a
// sticky override. Every step change routes through a view transition so the
// preview's named parts (field shell, label, trigger…) morph instead of swap.
// Dwell per mid beat when a manual navigation walks through them.
const MANUAL_BEAT_MS = 500

export function useCompositionPlayer() {
  const [step, setStep] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hoverPaused, setHoverPausedState] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Auto-play is motion — reduced-motion users opt in via the play button.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setUserPaused(true)
    }
  }, [])

  // Only animate while on screen — the clock parks itself otherwise.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  // Touch devices fire synthetic mouseenter with no matching leave — hover
  // pause would stick forever, so it only applies to real pointers.
  const setHoverPaused = useCallback((next: boolean) => {
    if (
      next &&
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return
    setHoverPausedState(next)
  }, [])

  // A view transition lifts every named element into a snapshot overlay that is
  // anchored to the viewport, not the scrolling page — so scrolling mid-morph
  // makes the frozen snapshots detach and float. Skip the morph while scrolling,
  // and snap any in-flight one to its end so it can't drift.
  const scrollingRef = useRef(false)
  const activeTransitionRef = useRef<{ skipTransition: () => void } | null>(
    null,
  )
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      scrollingRef.current = true
      activeTransitionRef.current?.skipTransition()
      clearTimeout(timer)
      timer = setTimeout(() => {
        scrollingRef.current = false
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  const stepRef = useRef(0)
  const applyStep = useCallback((next: number) => {
    stepRef.current = next
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || scrollingRef.current || !document.startViewTransition) {
      setStep(next)
      return
    }
    const transition = document.startViewTransition(() => {
      flushSync(() => setStep(next))
    })
    activeTransitionRef.current = transition
    transition.finished.finally(() => {
      if (activeTransitionRef.current === transition)
        activeTransitionRef.current = null
    })
  }, [])

  // Manual navigation (rail/dots): when the target is the next headline, play
  // the mid beats between here and there on a fast cadence instead of
  // hard-jumping, so the code still arrives in small blocks. Backward jumps
  // and far jumps (crossing another headline) stay direct.
  const walkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelWalk = useCallback(() => {
    if (walkTimerRef.current) {
      clearTimeout(walkTimerRef.current)
      walkTimerRef.current = null
    }
  }, [])
  useEffect(() => cancelWalk, [cancelWalk])

  const goToStep = useCallback(
    (next: number) => {
      cancelWalk()
      const from = stepRef.current
      const between = steps.slice(from + 1, next)
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (
        reduce ||
        next <= from ||
        between.length === 0 ||
        !between.every((s) => s.mid)
      ) {
        applyStep(next)
        return
      }
      const walk = () => {
        applyStep(stepRef.current + 1)
        if (stepRef.current < next) {
          walkTimerRef.current = setTimeout(walk, MANUAL_BEAT_MS)
        }
      }
      walk()
    },
    [applyStep, cancelWalk],
  )

  const advance = useCallback(
    () => applyStep((stepRef.current + 1) % steps.length),
    [applyStep],
  )

  // Hovering is a real pause to the reader, so the button reads and toggles
  // this rather than the explicit override alone. Excludes off-screen and
  // background-tab parking, which pause the clock but aren't the reader's doing.
  const paused = userPaused || hoverPaused
  const togglePlay = useCallback(() => {
    setUserPaused(!paused)
    // Resuming with the cursor still inside must actually resume.
    setHoverPausedState(false)
  }, [paused])

  const playing = mounted && inView && !hidden && !paused
  const current = steps[step] ?? firstStep
  // A mid step maps to the headline step it's building toward (the next
  // paginated entry), so that entry stays lit while the beats play.
  const activePaginated = Math.max(
    0,
    paginatedSteps.findIndex((p) => p.index >= step),
  )
  const stepDurationMs = current.durationMs
  const reducedMotion =
    mounted && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Under reduced motion the CSS clock is disabled (StepTimer renders nothing),
  // so an explicit play falls back to a plain timeout with instant swaps.
  useEffect(() => {
    if (!playing || !reducedMotion) return
    const id = setTimeout(advance, stepDurationMs)
    return () => clearTimeout(id)
  }, [playing, reducedMotion, step, stepDurationMs, advance])

  return {
    steps,
    step,
    goToStep,
    advance,
    playing,
    paused,
    togglePlay,
    setHoverPaused,
    mounted,
    containerRef,
    current,
    stepDurationMs,
    reducedMotion,
    paginated: paginatedSteps,
    activePaginated,
  }
}

// The step clock: an invisible bar animating over the step's duration. Render
// exactly one per player — onAnimationEnd is what advances the sequence, so
// the decorative progress bars (same animation, same play state) stay in sync
// with the actual tick by construction.
export function StepTimer({ player }: { player: CompositionPlayer }) {
  const { step, stepDurationMs, playing, advance, reducedMotion } = player
  if (reducedMotion) return null
  return (
    <span
      key={step}
      aria-hidden
      onAnimationEnd={advance}
      className="pointer-events-none fixed size-px opacity-0"
      style={progressStyle(stepDurationMs, playing, 'x')}
    />
  )
}

function progressStyle(
  durationMs: number,
  playing: boolean,
  axis: 'x' | 'y',
): React.CSSProperties {
  return {
    animationName: axis === 'x' ? 'cmp-progress-x' : 'cmp-progress-y',
    animationDuration: `${durationMs}ms`,
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationPlayState: playing ? 'running' : 'paused',
    willChange: 'transform',
  }
}

// A track clipping a full-size bar that slides in via translate — scaling a
// hairline bar re-rasterizes it every frame and visibly steps at slow speeds.
export function StepProgress({
  player,
  axis = 'x',
  className,
}: {
  player: CompositionPlayer
  axis?: 'x' | 'y'
  className?: string
}) {
  const { step, stepDurationMs, playing, reducedMotion } = player
  return (
    <span key={step} aria-hidden className={cn('overflow-hidden', className)}>
      <span
        className="block size-full bg-fg"
        style={
          reducedMotion
            ? undefined
            : progressStyle(stepDurationMs, playing, axis)
        }
      />
    </span>
  )
}

export function StepDots({
  player,
  className,
}: {
  player: CompositionPlayer
  className?: string
}) {
  const { paginated, activePaginated, goToStep } = player
  return (
    <div className={cn('flex items-center', className)}>
      {paginated.map((p, pos) => (
        <button
          key={p.title}
          type="button"
          aria-label={`Step ${pos + 1}: ${p.title}`}
          aria-current={pos === activePaginated ? 'step' : undefined}
          onClick={() => goToStep(p.index)}
          className="group flex h-8 cursor-pointer items-center px-[3px]"
        >
          <span
            className={cn(
              'relative h-1 overflow-hidden rounded-full transition-all duration-300',
              pos === activePaginated
                ? 'w-5 bg-border'
                : 'w-1.5 bg-border group-hover:bg-fg-muted',
            )}
          >
            {pos === activePaginated && (
              <StepProgress
                player={player}
                className="absolute inset-0 block rounded-full"
              />
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

export function PlayPauseButton({
  player,
  className,
}: {
  player: CompositionPlayer
  className?: string
}) {
  const { paused, togglePlay } = player
  return (
    <Button
      size="sm"
      variant="quiet"
      isIconOnly
      aria-label={paused ? 'Play steps' : 'Pause steps'}
      onPress={togglePlay}
      className={cn('text-fg-muted', className)}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </Button>
  )
}

export function CompositionTransitionStyles({
  morphMs = 450,
}: { morphMs?: number } = {}) {
  return (
    <style>{`
      /* Keep the page interactive while a transition runs, and confine the
         animation to the named preview parts — everything else swaps instantly. */
      ::view-transition { pointer-events: none; }
      ::view-transition-old(root) { display: none; }
      ::view-transition-new(root) { animation: none; }
      ::view-transition-group(cmp-field),
      ::view-transition-group(cmp-label),
      ::view-transition-group(cmp-desc),
      ::view-transition-group(cmp-trigger),
      ::view-transition-group(cmp-list),
      ::view-transition-group(cmp-kbd) {
        animation-duration: ${morphMs}ms;
        animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      ::view-transition-old(cmp-code) { display: none; }
      ::view-transition-new(cmp-code) { animation: none; }
      @keyframes cmp-progress-x { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      @keyframes cmp-progress-y { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-group(*),
        ::view-transition-old(*),
        ::view-transition-new(*) { animation: none; }
      }
    `}</style>
  )
}

export function CompositionCode({
  code,
  reducedMotion,
  duration = 700,
  stagger = 2,
}: {
  code: string
  reducedMotion: boolean
  duration?: number
  stagger?: number
}) {
  const { resolvedTheme } = useTheme()
  return (
    <ShikiMagicMove
      highlighter={highlighter}
      lang="tsx"
      theme={resolvedTheme === 'light' ? 'github-light' : 'github-dark'}
      code={code}
      options={{
        duration: reducedMotion ? 0 : duration,
        stagger,
        containerStyle: false,
        // Snap edit boundaries to line breaks, else the raw char diff strands
        // `<` and `/>` on the old line and moves only the tag name.
        diffCleanup: diffCleanupSemanticLossless,
      }}
    />
  )
}

export function CompositionAnimation({ className }: { className?: string }) {
  const player = useCompositionPlayer()
  const { mounted, containerRef, current, reducedMotion, setHoverPaused } =
    player

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden rounded-md border bg-card', className)}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      <CompositionTransitionStyles />
      <StepTimer player={player} />
      <div className="flex items-center justify-between gap-2 border-b py-1.5 pr-1.5 pl-2.5">
        <span className="truncate font-mono text-[0.8125rem] text-fg-muted">
          {current.title}
        </span>
        <div className="flex items-center gap-1">
          <StepDots player={player} />
          <PlayPauseButton player={player} />
        </div>
      </div>
      <div className="grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="no-scrollbar h-88 overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed [view-transition-name:cmp-code]">
          {mounted ? (
            <CompositionCode
              code={current.code}
              reducedMotion={reducedMotion}
            />
          ) : (
            <pre className="whitespace-pre">{current.code}</pre>
          )}
        </div>
        <div className="flex min-h-40 items-center justify-center border-t bg-bg p-6 sm:border-t-0 sm:border-l">
          {current.preview}
        </div>
      </div>
    </div>
  )
}
