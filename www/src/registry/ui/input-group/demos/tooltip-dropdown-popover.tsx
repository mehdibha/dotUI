'use client'

import { useState } from 'react'

import {
  ChevronDownIcon,
  InfoIcon,
  StarIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/registry/ui/dialog'
import { Description, Label } from '@/registry/ui/field'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

export default function Demo() {
  const [country, setCountry] = useState('+1')
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <TextField>
        <Label>Tooltip</Label>
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Tooltip>
              <Button variant="quiet" isIconOnly size="sm">
                <InfoIcon />
              </Button>
              <TooltipContent>This is content in a tooltip.</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <Description>This is a description of the input group.</Description>
      </TextField>
      <TextField>
        <Label>Dropdown</Label>
        <InputGroup>
          <InputGroupAddon>
            <Menu>
              <Button variant="quiet" size="sm">
                {country}
                <ChevronDownIcon />
              </Button>
              <Popover>
                <MenuContent>
                  <MenuItem onAction={() => setCountry('+1')}>+1</MenuItem>
                  <MenuItem onAction={() => setCountry('+44')}>+44</MenuItem>
                  <MenuItem onAction={() => setCountry('+46')}>+46</MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </InputGroupAddon>
          <Input />
        </InputGroup>
        <Description>This is a description of the input group.</Description>
      </TextField>
      <TextField>
        <Label>Popover</Label>
        <InputGroup>
          <InputGroupAddon>
            <Dialog>
              <Button variant="quiet" isIconOnly size="sm">
                <InfoIcon />
              </Button>
              <Popover>
                <DialogContent className="w-64 space-y-1">
                  <DialogTitle>Your connection is not secure.</DialogTitle>
                  <p className="text-sm text-fg-muted">
                    You should not enter any sensitive information on this site.
                  </p>
                </DialogContent>
              </Popover>
            </Dialog>
            <span className="text-fg-muted">https://</span>
          </InputGroupAddon>
          <Input />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly size="sm">
              <StarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Description>This is a description of the input group.</Description>
      </TextField>
    </div>
  )
}
