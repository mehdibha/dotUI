import React from "react";
import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarPlaceholder,
} from "@/registry/ui/default/core/avatar";
import { UserIcon } from "@/__icons__";

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
