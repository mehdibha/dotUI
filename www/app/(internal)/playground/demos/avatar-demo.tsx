"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarPlaceholder,
  AvatarRoot,
} from "@dotui/registry/ui/avatar";

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

          <AvatarRoot size={size}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>S</AvatarFallback>
            <AvatarPlaceholder />
          </AvatarRoot>

          <AvatarGroup size={size}>
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
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}
