"use client";

import { SettingsIcon } from "lucide-react";
import { useConfig } from "@/hooks/use-config";
import type { IconLibrary } from "@/types/icons";
import { Button } from "@/registry/ui/default/core/button";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";

const ThemeCustomizer = () => {
  const { iconLibrary, setIconLibrary } = useConfig();
  return (
    <DialogRoot>
      <Button
        aria-label="Customize Theme"
        variant="quiet"
        size="sm"
        shape="square"
        className="absolute right-2 top-2"
      >
        <SettingsIcon />
      </Button>
      <Dialog type="popover" title="Customize theme">
        <Select
          selectedKey={iconLibrary}
          onSelectionChange={(key) => setIconLibrary(key as IconLibrary)}
        >
          <Item id="lucide">Lucide icons</Item>
          <Item id="remix">Remix icons</Item>
          <Item id="radix">Radix icons</Item>
          <Item id="heroicons">Heroicons</Item>
          <Item id="feather">Feather icons</Item>
        </Select>
      </Dialog>
    </DialogRoot>
  );
};

export { ThemeCustomizer };
