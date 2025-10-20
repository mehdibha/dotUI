"use client";

import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { Combobox } from "@dotui/registry-v2/ui/combobox";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input } from "@dotui/registry-v2/ui/input";
import { Avatar } from "@dotui/registry/ui/avatar";

export function ComboboxDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Combobox defaultSelectedKey="tanstack-start">
        <Label>Framework</Label>
        <Combobox.Input />
        <Combobox.Popover>
          <Combobox.List>
            <Combobox.Item id="tanstack-start">Tanstack start</Combobox.Item>
            <Combobox.Item id="remix">Remix</Combobox.Item>
            <Combobox.Item id="gatsby">Gatsby</Combobox.Item>
            <Combobox.Item id="nextjs">Next.js</Combobox.Item>
            <Combobox.Item id="vuejs">Vue.js</Combobox.Item>
          </Combobox.List>
        </Combobox.Popover>
      </Combobox>

      <Combobox>
        <Label>Users</Label>
        <Input.Group>
          <Input />
          <Input.Addon>
            <Button>
              <ChevronsUpDownIcon />
            </Button>
          </Input.Addon>
        </Input.Group>
        <Combobox.Popover>
          <Combobox.List
            items={[
              { username: "mehdibha", img: "https://github.com/mehdibha.png" },
              {
                username: "devongovett",
                img: "https://github.com/devongovett.png",
              },
              { username: "shadcn", img: "https://github.com/shadcn.png" },
            ]}
          >
            {(user) => (
              <Combobox.Item id={user.username}>
                <Avatar
                  src={user.img}
                  fallback={user.username.charAt(0)}
                  className="size-6"
                />
                {user.username}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popover>
      </Combobox>

      <Combobox defaultSelectedKey="mehdibha">
        <Label>Users</Label>
        <Input.Group>
          <Input />
          <Input.Addon>
            <Button>
              <ChevronsUpDownIcon />
            </Button>
          </Input.Addon>
        </Input.Group>
        <Combobox.Popover>
          <Combobox.List
            items={[
              { username: "mehdibha", img: "https://github.com/mehdibha.png" },
              {
                username: "devongovett",
                img: "https://github.com/devongovett.png",
              },
              { username: "shadcn", img: "https://github.com/shadcn.png" },
            ]}
          >
            {(user) => (
              <Combobox.Item id={user.username}>
                <Avatar
                  src={user.img}
                  fallback={user.username.charAt(0)}
                  className="size-6"
                />
                {user.username}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popover>
      </Combobox>
      {/* Combobox with create option */}
    </div>
  );
}
