import { Button } from "@/lib/components/core/default/button";
import { Menu, MenuItem, MenuRoot } from "@/lib/components/core/default/menu";
import { Separator } from "@/lib/components/core/default/separator";

export default function Demo() {
  return (
    <MenuRoot>
      <Button>Settings</Button>
      <Menu>
        <MenuItem>Push notifications</MenuItem>
        <MenuItem>Badges</MenuItem>
        <Separator />
        <MenuItem id="console">Console</MenuItem>
        <Separator />
        <MenuItem>Search</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
