import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem, MenuSection } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

export default function Demo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {(['bottom', 'top', 'left', 'right', 'start', 'end'] as const).map(
        (placement) => (
          <Menu key={placement}>
            <Button variant="default" className="w-fit capitalize">
              {placement}
            </Button>
            <Popover placement={placement}>
              <MenuContent>
                <MenuSection>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Billing</MenuItem>
                  <MenuItem>Settings</MenuItem>
                </MenuSection>
              </MenuContent>
            </Popover>
          </Menu>
        ),
      )}
    </div>
  )
}
