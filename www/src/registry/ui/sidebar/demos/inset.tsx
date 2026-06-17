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
      <Sidebar variant="inset">
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
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Inset</span>
        </header>
        <div className="flex-1 p-3">
          <div className="size-full rounded-lg bg-muted" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
