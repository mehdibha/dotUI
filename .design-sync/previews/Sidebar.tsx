import {
  CalendarIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from 'www'

const items = [
  { title: 'Dashboard', icon: HomeIcon, isActive: true },
  { title: 'Inbox', icon: InboxIcon, badge: '12' },
  { title: 'Calendar', icon: CalendarIcon },
  { title: 'Search', icon: SearchIcon },
  { title: 'Settings', icon: SettingsIcon },
]

const provider: React.CSSProperties = {
  height: '40rem',
  minHeight: 0,
  overflow: 'hidden',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
}
const brandMark: React.CSSProperties = {
  display: 'flex',
  aspectRatio: '1 / 1',
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  background: 'var(--color-primary)',
  color: 'var(--color-fg-on-primary)',
}
const stackLabel: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  lineHeight: 1,
}
const headerBar: React.CSSProperties = {
  display: 'flex',
  height: 48,
  flexShrink: 0,
  alignItems: 'center',
  gap: 8,
  borderBottom: '1px solid var(--color-border)',
  paddingInline: 12,
}
const body: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: 12,
  padding: 12,
}
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
}
const tile: React.CSSProperties = {
  aspectRatio: '16 / 9',
  borderRadius: 8,
  background: 'var(--color-muted)',
}
const fill: React.CSSProperties = {
  flex: 1,
  borderRadius: 8,
  background: 'var(--color-muted)',
}

export const Default = () => (
  <SidebarProvider style={provider}>
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme Inc">
              <div style={brandMark}>
                <SparklesIcon style={{ width: 16, height: 16 }} />
              </div>
              <div style={stackLabel}>
                <span style={{ fontWeight: 500, color: 'var(--color-fg)' }}>
                  Acme Inc
                </span>
                <span style={{ fontSize: 12 }}>Enterprise</span>
              </div>
              <ChevronsUpDownIcon style={{ marginLeft: 'auto' }} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Mehdi">
              <Avatar style={{ width: 32, height: 32 }}>
                <AvatarImage src="https://github.com/mehdibha.png" alt="Mehdi" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div style={stackLabel}>
                <span style={{ fontWeight: 500, color: 'var(--color-fg)' }}>
                  Mehdi
                </span>
                <span style={{ fontSize: 12 }}>m@example.com</span>
              </div>
              <ChevronsUpDownIcon style={{ marginLeft: 'auto' }} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header style={headerBar}>
        <SidebarTrigger />
        <span style={{ fontSize: 14, fontWeight: 500 }}>Dashboard</span>
      </header>
      <div style={body}>
        <div style={grid}>
          <div style={tile} />
          <div style={tile} />
          <div style={tile} />
        </div>
        <div style={fill} />
      </div>
    </SidebarInset>
  </SidebarProvider>
)
