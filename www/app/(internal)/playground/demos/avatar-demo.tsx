"use client";

import { Avatar } from "@dotui/registry/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <Avatar
            src="https://github.com/mehdibha.png"
            fallback="M"
            size={size}
          />

          <Avatar fallback="M" size={size} />

          <Avatar.Root size={size}>
            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
            <Avatar.Fallback>S</Avatar.Fallback>
            <Avatar.Placeholder />
          </Avatar.Root>

          <Avatar.Group size={size}>
            <Avatar
              src="https://github.com/mehdibha.png"
              alt="@mehdibha"
              fallback="BHA"
            />
            <Avatar
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              fallback="S"
            />
            <Avatar
              src="https://github.com/devongovett.png"
              alt="@devongovett"
              fallback="DG"
            />
          </Avatar.Group>
        </div>
      ))}
    </div>
  );
}
