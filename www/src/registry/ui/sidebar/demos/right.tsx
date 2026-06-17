import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from '@/registry/__generated__/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/registry/ui/sidebar'

const items = [
  { title: 'Dashboard', icon: HomeIcon, isActive: true },
  { title: 'Inbox', icon: InboxIcon },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Settings', icon: SettingsIcon },
]

export default function Demo() {
  return (
    <SidebarProvider className="h-96 min-h-0 overflow-hidden rounded-lg border">
      {/* For a right sidebar, render it after the inset so it reserves space on the right. */}
      <SidebarInset>
        <header className="flex h-12 items-center justify-end gap-2 border-b px-3">
          <span className="text-sm font-medium">Aligned right</span>
          <SidebarTrigger />
        </header>
      </SidebarInset>
      <Sidebar side="right">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
    </SidebarProvider>
  )
}
