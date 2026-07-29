import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
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
} from '@/registry/ui/sidebar'

const items = [
  { title: 'Dashboard', icon: HomeIcon, isActive: true },
  { title: 'Inbox', icon: InboxIcon },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Search', icon: SearchIcon },
  { title: 'Settings', icon: SettingsIcon },
]

export function SidebarDemo() {
  return (
    <SidebarProvider className="h-80 min-h-0 w-[26rem] overflow-hidden rounded-lg border">
      <Sidebar>
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
      <SidebarInset>
        <div className="h-10 border-b" />
        <div className="flex-1 p-3">
          <div className="size-full rounded-lg bg-muted" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
