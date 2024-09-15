import React from "react";
import { UserIcon } from "@/__icons__";
import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarPlaceholder,
} from "@/registry/ui/default/core/avatar";

export default function Demo() {
  return (
    <AvatarRoot>
      <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
      <AvatarFallback>M</AvatarFallback>
      <AvatarPlaceholder>
        <UserIcon className="size-5" />
      </AvatarPlaceholder>
    </AvatarRoot>
  );
}
