import 'shiki-magic-move/style.css'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { parseDate } from '@internationalized/date'
import {
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT,
  diffCleanupSemanticLossless,
  type Diff,
} from 'diff-match-patch-es'
import { PauseIcon, PlayIcon } from 'lucide-react'
import {
  codeToKeyedTokens,
  syncTokenKeys,
  toKeyedTokens,
} from 'shiki-magic-move/core'
import { ShikiMagicMoveRenderer } from 'shiki-magic-move/react'
import type { KeyedToken, KeyedTokensInfo } from 'shiki-magic-move/types'
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
  // Part of the compact loop played when the home section stacks vertically —
  // only steps within a few code lines of each other, so the pane height
  // barely moves (see compactSteps).
  compact?: boolean
}

const firstStep: Step = {
  title: 'Input',
  durationMs: 2400,
  code: `<Input placeholder="hello@example.com" />`,
  preview: (
    <Input
      aria-label="Email"
      placeholder="hello@example.com"
      className="w-full max-w-xs [view-transition-name:cmp-field]"
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
      <TextField aria-label="Email" className="w-full max-w-xs">
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
      <TextField className="w-full max-w-xs">
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
      <TextField className="w-full max-w-xs">
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
      <TextField className="w-full max-w-xs">
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
    compact: true,
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
      <TextField className="w-full max-w-xs">
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
    compact: true,
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
      <SearchField className="w-full max-w-xs">
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
    compact: true,
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
      <DateField
        className="w-full max-w-xs"
        defaultValue={parseDate('2026-07-10')}
      >
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
      <DatePicker
        className="w-full max-w-xs"
        defaultValue={parseDate('2026-07-10')}
      >
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
      <DatePicker
        className="w-full max-w-xs"
        defaultValue={parseDate('2026-07-10')}
      >
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
        className="w-full max-w-xs"
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
    // 110 tokens: the transition needs ~1410ms to land (see CODE_SPAN).
    durationMs: 1500,
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
        className="w-full max-w-xs"
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
        className="w-full max-w-xs"
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
      <Select className="w-full max-w-xs">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-field]" />
      </Select>
    ),
  },
  {
    // Headline: attach the options list.
    title: 'Select',
    compact: true,
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
      <Select className="w-full max-w-xs" defaultSelectedKey="cara">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-field]" />
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
      <Select className="w-full max-w-xs" defaultSelectedKey="cara">
        <Label className="[view-transition-name:cmp-label]">Assignee</Label>
        <SelectTrigger className="[view-transition-name:cmp-field]" />
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
      <Combobox className="w-full max-w-xs">
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
      <Combobox className="w-full max-w-xs">
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
    compact: true,
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
    compact: true,
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
      <ContextMenu className="bg-bg-muted flex h-24 w-full max-w-xs items-center justify-center rounded-md border border-dashed text-sm text-fg-muted">
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
      <Mention className="w-full max-w-xs">
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
      <Mention className="w-full max-w-xs">
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
      <div className="w-full max-w-xs overflow-hidden rounded-md border bg-bg">
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
      <div className="w-full max-w-xs overflow-hidden rounded-md border bg-bg">
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
      <div className="w-full max-w-xs overflow-hidden rounded-md border bg-bg">
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

const maxLines = (list: Step[]) =>
  Math.max(...list.map((s) => s.code.split('\n').length))

const compactSteps = steps.filter((s) => s.compact)
export const maxCodeLines = maxLines(steps)
export const compactMaxCodeLines = maxLines(compactSteps)

// Pagination lists only the headline steps; mid steps play during auto-advance
// but aren't clickable stops. Each entry keeps its index into its list so the
// rail/dots can jump straight to it.
const paginate = (list: Step[]) =>
  list
    .map((s, index) => ({ title: s.title, index, mid: s.mid }))
    .filter((s) => !s.mid)
const paginatedSteps = paginate(steps)
const compactPaginatedSteps = paginate(compactSteps)

export type CompositionPlayer = ReturnType<typeof useCompositionPlayer>

// shiki-magic-move delays each phase by a *fraction of* `duration` and then runs
// it for a further 1×duration. Enter is last, so a transition ends at
// (1 + delayEnter)×duration + the stagger tail — not at `duration`. Every dwell
// above has to clear that, or the next step cuts the animation off mid-flight.
const CODE_ENTER_DELAY = 0.7
const CODE_SPAN = 1 + CODE_ENTER_DELAY
const CODE_DURATION_MS = 700
const CODE_STAGGER_MS = 2

// A manual walk plays the exact same code transition as auto-play, only with a
// smaller stagger — so each beat must clear the full span plus the stagger tail
// of the longest (~120-token) snippet.
const WALK_CODE_STAGGER_MS = 0.5
const MANUAL_BEAT_MS = Math.ceil(
  CODE_SPAN * CODE_DURATION_MS + 120 * WALK_CODE_STAGGER_MS,
)

// Shared player: auto-advance while visible, with a CSS animation as the step
// clock (see StepTimer) so the visible progress and the advance tick can never
// drift. Hovering or focusing the showcase pauses; the play/pause button is a
// sticky override. Every step change routes through a view transition so the
// preview's named parts (field shell, label, trigger…) morph instead of swap.
// `compactBelowLg` swaps in the compact loop when the viewport is under the
// lg breakpoint. It flips after mount only, so server and hydration markup
// always show the full list's first step.
export function useCompositionPlayer({ compactBelowLg = false } = {}) {
  const [step, setStep] = useState(0)
  const [compact, setCompact] = useState(false)
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

  useEffect(() => {
    if (!compactBelowLg) return
    const mq = window.matchMedia('(min-width: 64rem)')
    const update = () => setCompact(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [compactBelowLg])
  const activeSteps = compact ? compactSteps : steps

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

  // Restart from the top when the step list swaps (breakpoint cross) — the
  // current index points into the other list.
  useEffect(() => {
    cancelWalk()
    stepRef.current = 0
    setStep(0)
  }, [compact, cancelWalk])

  const [walking, setWalking] = useState(false)
  const goToStep = useCallback(
    (next: number) => {
      cancelWalk()
      const from = stepRef.current
      const between = activeSteps.slice(from + 1, next)
      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      if (
        reduce ||
        next <= from ||
        between.length === 0 ||
        !between.every((s) => s.mid)
      ) {
        setWalking(false)
        applyStep(next)
        return
      }
      setWalking(true)
      const walk = () => {
        applyStep(stepRef.current + 1)
        if (stepRef.current < next) {
          walkTimerRef.current = setTimeout(walk, MANUAL_BEAT_MS)
        } else {
          // Clears in the same commit as the final step, so the arrival plays at
          // full duration — nothing follows it to cut it off.
          setWalking(false)
        }
      }
      walk()
    },
    [applyStep, cancelWalk, activeSteps],
  )

  const advance = useCallback(
    () => applyStep((stepRef.current + 1) % activeSteps.length),
    [applyStep, activeSteps],
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
  const paginated = compact ? compactPaginatedSteps : paginatedSteps
  // The index may briefly outlive a list swap — the reset effect above hasn't
  // run yet on that render.
  const current =
    activeSteps[Math.min(step, activeSteps.length - 1)] ?? firstStep
  // A mid step maps to the headline step it's building toward (the next
  // paginated entry), so that entry stays lit while the beats play.
  const activePaginated = Math.max(
    0,
    paginated.findIndex((p) => p.index >= step),
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
    steps: activeSteps,
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
    paginated,
    activePaginated,
    codeStaggerMs: walking ? WALK_CODE_STAGGER_MS : CODE_STAGGER_MS,
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

// The char diff happily matches stray punctuation across unrelated tags, so a
// lone `<` or `/>` slides across the pane while the tag it belonged to fades.
// After snapping boundaries to line breaks, demote every matched run that
// lands on a different line but holds no whole word — it fades with its tag
// instead of flying. Runs that keep words slide as blocks, and same-line runs
// stay matched, so anchored brackets (the Popover → Modal one-word swap) hold
// still. A word *fragment* at a run's edge (`Field>` shared by `</TextField>`
// and `</SearchField>`) doesn't count: it can never match a whole token, so
// only its punctuation would fly.
const WORD = /[A-Za-z0-9]/

function cleanupCodeDiff(diffs: Diff[]): Diff[] {
  diffCleanupSemanticLossless(diffs)
  let from = ''
  let to = ''
  for (const [op, text] of diffs) {
    if (op !== DIFF_INSERT) from += text
    if (op !== DIFF_DELETE) to += text
  }
  const out: Diff[] = []
  let offFrom = 0
  let offTo = 0
  let lineFrom = 0
  let lineTo = 0
  for (const [op, text] of diffs) {
    let demote = false
    if (op === DIFF_EQUAL && lineFrom !== lineTo) {
      let core = text
      const end = text.length
      if (
        WORD.test(core[0] ?? '') &&
        (WORD.test(from[offFrom - 1] ?? '') || WORD.test(to[offTo - 1] ?? ''))
      ) {
        core = core.replace(/^[A-Za-z0-9]+/, '')
      }
      if (
        WORD.test(core[core.length - 1] ?? '') &&
        (WORD.test(from[offFrom + end] ?? '') ||
          WORD.test(to[offTo + end] ?? ''))
      ) {
        core = core.replace(/[A-Za-z0-9]+$/, '')
      }
      demote = !WORD.test(core)
    }
    if (demote) {
      out.push([DIFF_DELETE, text], [DIFF_INSERT, text])
    } else {
      out.push([op, text])
    }
    const lines = text.split('\n').length - 1
    if (op !== DIFF_INSERT) {
      offFrom += text.length
      lineFrom += lines
    }
    if (op !== DIFF_DELETE) {
      offTo += text.length
      lineTo += lines
    }
  }
  return out
}

// A bracket belongs to its tag name — `<`/`</` to the name after it, the
// closing `>`/`/>` to the name before it. The char diff doesn't know that:
// wrapping `<Input />` in `<TextField>` matches old `<Input`'s bracket to new
// `<TextField`'s, so the `<` stays behind while `Input` slides away. After the
// library syncs keys, rebind every surviving tag name's brackets to its own —
// stealing the key back when the diff gave it to another tag — and unmatch any
// leftover punctuation pair that still jumps lines. Same-line leftovers stay:
// a swapped-in-place tag (Popover → Modal) keeps its brackets still.
const TAG_NAME = /^[A-Za-z][\w.]*$/

function lockTagPunctuation(from: KeyedTokensInfo, to: KeyedTokensInfo) {
  const fromByKey = new Map(from.tokens.map((t) => [t.key, t]))
  const toByKey = new Map(to.tokens.map((t) => [t.key, t]))
  const bound = new Set<KeyedToken>()
  let freed = 0

  const bind = (target: KeyedToken, key: string) => {
    bound.add(target)
    if (target.key === key) return
    const holder = toByKey.get(key)
    if (holder) {
      holder.key = `${to.hash}-freed-${freed++}`
      toByKey.set(holder.key, holder)
    }
    toByKey.delete(target.key)
    target.key = key
    toByKey.set(key, target)
  }

  // The tag's closing bracket: first `>`-bearing token after the name, as
  // long as no other tag opens first (tags in the snippets are single-line).
  const closeOf = (tokens: KeyedToken[], nameIdx: number) => {
    for (const token of tokens.slice(nameIdx + 1)) {
      const c = token.content
      if (c === '\n' || c.includes('<')) return undefined
      if (c.includes('>')) return token
    }
    return undefined
  }

  for (let i = 1; i < to.tokens.length; i++) {
    const name = to.tokens[i]
    const bracket = to.tokens[i - 1]
    if (!name || !bracket) continue
    if (bracket.content !== '<' && bracket.content !== '</') continue
    if (!TAG_NAME.test(name.content)) continue
    const fromName = fromByKey.get(name.key)
    if (!fromName) continue
    const fromIdx = from.tokens.indexOf(fromName)
    const fromBracket = fromIdx > 0 ? from.tokens[fromIdx - 1] : undefined
    if (fromBracket?.content !== bracket.content) continue
    bind(bracket, fromBracket.key)
    const toClose = closeOf(to.tokens, i)
    const fromClose = closeOf(from.tokens, fromIdx)
    if (toClose && fromClose && toClose.content === fromClose.content) {
      bind(toClose, fromClose.key)
    }
  }

  const lineOf = (source: string, offset: number) =>
    source.slice(0, offset).split('\n').length
  for (const token of to.tokens) {
    if (bound.has(token)) continue
    const partner = fromByKey.get(token.key)
    if (!partner) continue
    const c = token.content
    if (c.trim() === '' || WORD.test(c)) continue
    if (lineOf(from.code, partner.offset) !== lineOf(to.code, token.offset)) {
      toByKey.delete(token.key)
      token.key = `${to.hash}-freed-${freed++}`
      toByKey.set(token.key, token)
    }
  }
}

const EMPTY_TOKENS = toKeyedTokens('', [])

export function CompositionCode({
  code,
  reducedMotion,
  duration = CODE_DURATION_MS,
  stagger = CODE_STAGGER_MS,
}: {
  code: string
  reducedMotion: boolean
  duration?: number
  stagger?: number
}) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'github-light' : 'github-dark'
  // Inlined ShikiMagicMove machine so lockTagPunctuation can rewrite the
  // synced keys before they reach the renderer. The code/theme guard keeps a
  // strict-mode double render from committing the same step twice (which
  // would make from === to and swallow the transition).
  const cache = useRef<{ from: KeyedTokensInfo; to: KeyedTokensInfo } | null>(
    null,
  )
  const step = useMemo(() => {
    const previous = cache.current?.to ?? EMPTY_TOKENS
    if (previous.code === code && previous.themeName === theme) {
      return cache.current!
    }
    const next = codeToKeyedTokens(highlighter, code, { lang: 'tsx', theme })
    const { from, to } = syncTokenKeys(previous, next, {
      diffCleanup: cleanupCodeDiff,
    })
    lockTagPunctuation(from, to)
    cache.current = { from, to }
    return cache.current
  }, [code, theme])
  return (
    <ShikiMagicMoveRenderer
      tokens={step.to}
      previous={step.from}
      options={{
        duration: reducedMotion ? 0 : duration,
        stagger,
        // Pinned: CODE_SPAN is only correct if this is what the renderer uses.
        delayEnter: CODE_ENTER_DELAY,
        containerStyle: false,
      }}
    />
  )
}

export function CompositionAnimation({ className }: { className?: string }) {
  const player = useCompositionPlayer()
  const {
    mounted,
    containerRef,
    current,
    reducedMotion,
    setHoverPaused,
    codeStaggerMs,
  } = player

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
              stagger={codeStaggerMs}
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
