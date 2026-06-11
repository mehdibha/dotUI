import { Button } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { DiscordIcon } from '@/components/icons/discord'
import { GitHubIcon } from '@/components/icons/github'
import { TwitterIcon } from '@/components/icons/twitter'

export default function Demo() {
  return (
    <Menu>
      <Button variant="default" size="sm">
        Social
      </Button>
      <Popover>
        <MenuContent>
          <MenuItem>
            <GitHubIcon />
            Github
          </MenuItem>
          <MenuItem href="https://twitter.com/mehdibha" target="_blank">
            <TwitterIcon />X
          </MenuItem>
          <MenuItem
            href="https://discord.com/invite/DXpj5V2fU8"
            target="_blank"
          >
            <DiscordIcon />
            Discord
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}
