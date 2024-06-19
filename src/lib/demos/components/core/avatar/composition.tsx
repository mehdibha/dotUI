import React from "react";
import { User2Icon } from "lucide-react";
import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarPlaceholder,
} from "@/lib/components/core/default/avatar";

export default function Demo() {
  return (
    <AvatarRoot>
      <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
      <AvatarFallback>M</AvatarFallback>
      <AvatarPlaceholder>
        <User2Icon className="size-5" />
      </AvatarPlaceholder>
    </AvatarRoot>
  );
}
