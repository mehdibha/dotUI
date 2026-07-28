'use client'

import {
  ArrowRightIcon,
  BoldIcon,
  ChevronDownIcon,
  ItalicIcon,
  SearchIcon,
  UnderlineIcon,
} from '@/registry/icons'
import { cn } from '@/registry/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/registry/ui/avatar'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Card, CardContent } from '@/registry/ui/card'
import { Checkbox } from '@/registry/ui/checkbox'
import { Group } from '@/registry/ui/group'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { Link } from '@/registry/ui/link'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '@/registry/ui/number-field'
import { Popover } from '@/registry/ui/popover'
import { Radio, RadioGroup } from '@/registry/ui/radio-group'
import { SearchField } from '@/registry/ui/search-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Separator } from '@/registry/ui/separator'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

// A sampler of the core design-system controls: buttons, fields, badges,
// selection controls, toggles, slider and a split-button menu.
export function Controls({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary">
            Button
            <ArrowRightIcon />
          </Button>
          <Button>Default</Button>
          <Button variant="quiet">Quiet</Button>
        </div>
        <SearchField aria-label="Search">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Search" />
            <InputGroupAddon>
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </SearchField>
        <div className="flex gap-2">
          <Select
            aria-label="Role"
            placeholder="Role"
            className="min-w-0 flex-1"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="admin">Admin</SelectItem>
              <SelectItem id="member">Member</SelectItem>
              <SelectItem id="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <NumberField
            aria-label="Quantity"
            defaultValue={3}
            className="w-fit shrink-0"
          >
            <Group>
              <NumberFieldDecrement />
              <Input className="w-8 text-center" />
              <NumberFieldIncrement />
            </Group>
          </NumberField>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Badge</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge appearance="subtle" variant="accent">
              Subtle
            </Badge>
          </div>
          <AvatarGroup size="sm" className="*:data-avatar:ring-card">
            <Avatar size="sm">
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <AvatarGroupCount className="ring-card">+3</AvatarGroupCount>
          </AvatarGroup>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToggleButtonGroup
            aria-label="Text formatting"
            defaultSelectedKeys={['bold']}
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
          <div className="flex items-center gap-2.5">
            <Checkbox aria-label="Checkbox" defaultSelected />
            <Switch aria-label="Switch" defaultSelected />
            <RadioGroup
              aria-label="Radio buttons"
              defaultValue="on"
              className="flex-row gap-2"
            >
              <Radio value="on" aria-label="Selected" />
              <Radio value="off" aria-label="Not selected" />
            </RadioGroup>
          </div>
        </div>
        <Slider aria-label="Value" defaultValue={64}>
          <div className="flex items-center gap-3">
            <SliderControl className="min-w-0 flex-1" />
            <SliderOutput className="shrink-0" />
          </div>
        </Slider>
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="#" className="text-sm">
            All components
            <ArrowRightIcon className="size-3.5" />
          </Link>
          <Group>
            <Button>Actions</Button>
            <Menu>
              <Button isIconOnly aria-label="More actions">
                <ChevronDownIcon />
              </Button>
              <Popover placement="bottom end">
                <MenuContent>
                  <MenuItem>Duplicate</MenuItem>
                  <MenuItem>Share</MenuItem>
                  <MenuItem variant="danger">Delete</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </Group>
        </div>
      </CardContent>
    </Card>
  )
}
