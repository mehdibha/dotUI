import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" size="sm">
        Panels
      </Button>
      <Menu
        selectionMode="multiple"
        defaultSelectedKeys={["sidebar", "searchbar", "console"]}
      >
        <MenuItem id="sidebar">Sidebar</MenuItem>
        <MenuItem id="searchbar">Searchbar</MenuItem>
        <MenuItem id="tools">Tools</MenuItem>
        <MenuItem id="console">Console</MenuItem>
      </Menu>
    </MenuRoot>
  );
}
