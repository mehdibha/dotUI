'use client'

import { MenuIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'

import { OverlayScene, useOpenAutoplay } from '../autoplay'

export function MenuDemo() {
  const { phase } = useOpenAutoplay()
  return (
    <OverlayScene
      phase={phase}
      variant="menu"
      side="bottom"
      surfaceClassName="w-44 p-0"
      trigger={
        <Button aria-label="Menu" isIconOnly>
          <MenuIcon />
        </Button>
      }
    >
      <ListBox
        aria-label="Menu"
        className="border-0 bg-transparent shadow-none"
      >
        <ListBoxItem id="account">Account settings</ListBoxItem>
        <ListBoxItem id="team">Create team</ListBoxItem>
        <ListBoxItem id="command">Command menu</ListBoxItem>
        <ListBoxItem id="logout">Log out</ListBoxItem>
      </ListBox>
    </OverlayScene>
  )
}
