'use client'

import * as React from 'react'

import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/registry/ui/sidebar'

const items = [
  { title: 'Dashboard', icon: HomeIcon, isActive: true },
  { title: 'Inbox', icon: InboxIcon },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Settings', icon: SettingsIcon },
]

export default function Demo() {
  const [isOpen, setOpen] = React.useState(true)

  return (
    <SidebarProvider
      isOpen={isOpen}
      onOpenChange={setOpen}
      className="h-96 min-h-0 overflow-hidden rounded-lg border"
    >
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.isActive}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <Button size="sm" onPress={() => setOpen((open) => !open)}>
            {isOpen ? 'Close' : 'Open'} sidebar
          </Button>
          <span className="text-sm text-fg-muted">
            State: {isOpen ? 'expanded' : 'collapsed'}
          </span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
