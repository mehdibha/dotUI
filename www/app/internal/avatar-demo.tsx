"use client";

import { Avatar } from "@dotui/registry-v2/ui/avatar";

export function AvatarDemo() {
  return (
    <div className="flex flex-col gap-4">
      {["sm", "md", "lg"].map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <Avatar src="https://github.com/mehdibha.png" fallback="M" />
          <Avatar fallback="M" />
          <Avatar src="https://github.com/devongovett.png" fallback="ER" />
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-bg *:data-[slot=avatar]:grayscale">
            <Avatar.Root>
              <Avatar.Image
                src="https://github.com/mehdibha.png"
                alt="@mehdibha"
              />
              <Avatar.Fallback>BHA</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root>
              <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
              <Avatar.Fallback>S</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root>
              <Avatar.Image
                src="https://github.com/devongovett.png"
                alt="@devongovett"
              />
              <Avatar.Fallback>DG</Avatar.Fallback>
            </Avatar.Root>
          </div>
        </div>
      ))}
    </div>
  );
}
