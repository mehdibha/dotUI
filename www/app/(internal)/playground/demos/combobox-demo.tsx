"use client";

import { Combobox, ComboboxItem } from "@dotui/registry-v2/ui/combobox";
import { Avatar } from "@dotui/registry/ui/avatar";

export function ComboboxDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Combobox label="Framework" defaultSelectedKey="tanstack-start">
        <ComboboxItem id="tanstack-start">Tanstack start</ComboboxItem>
        <ComboboxItem id="remix">Remix</ComboboxItem>
        <ComboboxItem id="gatsby">Gatsby</ComboboxItem>
        <ComboboxItem id="nextjs">Next.js</ComboboxItem>
        <ComboboxItem id="vuejs">Vue.js</ComboboxItem>
      </Combobox>
      <Combobox
        label="Users"
        defaultSelectedKey={"mehdibha"}
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
          <ComboboxItem
            id={user.username}
            prefix={
              <Avatar
                src={user.img}
                fallback={user.username.charAt(0)}
                className="size-6"
              />
            }
          >
            {user.username}
          </ComboboxItem>
        )}
      </Combobox>
      {/* Combobox with create option */}
    </div>
  );
}
