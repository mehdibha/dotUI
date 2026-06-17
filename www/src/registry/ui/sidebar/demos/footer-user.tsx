import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
} from '@/registry/__generated__/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
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
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Menu>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarImage
                      src="https://github.com/mehdibha.png"
                      alt="Mehdi"
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-fg">Mehdi</span>
                    <span className="text-xs">m@example.com</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
                <Popover placement="top" className="w-(--trigger-width)">
                  <MenuContent>
                    <MenuItem>
                      <SettingsIcon />
                      Account
                    </MenuItem>
                    <MenuItem>
                      <CreditCardIcon />
                      Billing
                    </MenuItem>
                    <MenuItem>
                      <LogOutIcon />
                      Log out
                    </MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">User menu</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
