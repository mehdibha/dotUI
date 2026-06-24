'use client'

import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

export function ComboboxDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
      variant="menu"
      side="bottom"
      fluid
      surfaceClassName="w-full max-w-[14rem] p-0"
      trigger={
        <InputGroup className="w-full max-w-[14rem]">
          <Input placeholder="Select country..." value="France" readOnly />
          <InputGroupAddon>
            <Button variant="quiet" isIconOnly>
              <ChevronDownIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      }
    >
      <ListBox
        aria-label="Country"
        selectionMode="single"
        selectedKeys={['france']}
        className="border-0 bg-transparent shadow-none"
      >
        <ListBoxItem id="canada">Canada</ListBoxItem>
        <ListBoxItem id="france">France</ListBoxItem>
        <ListBoxItem id="germany">Germany</ListBoxItem>
        <ListBoxItem id="japan">Japan</ListBoxItem>
      </ListBox>
    </OverlayScene>
  )
}
