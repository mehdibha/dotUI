import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  MoreHorizontalIcon,
} from '@/registry/__generated__/icons'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/registry/ui/sidebar'

export default function Demo() {
  return (
    <SidebarProvider className="h-96 min-h-0 overflow-hidden rounded-lg border">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <HomeIcon />
                  <span>Dashboard</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <InboxIcon />
                  <span>Inbox</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CalendarIcon />
                  <span>Calendar</span>
                </SidebarMenuButton>
                <Menu>
                  <SidebarMenuAction showOnHover aria-label="More">
                    <MoreHorizontalIcon />
                  </SidebarMenuAction>
                  <Popover>
                    <MenuContent>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem>Share</MenuItem>
                      <MenuItem>Delete</MenuItem>
                    </MenuContent>
                  </Popover>
                </Menu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Badges &amp; actions</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
