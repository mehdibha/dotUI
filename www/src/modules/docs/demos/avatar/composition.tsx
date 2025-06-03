import React from "react";
import {
  AvatarFallback,
  AvatarImage,
  AvatarPlaceholder,
  AvatarRoot,
} from "@/components/dynamic-ui/avatar";
import { User2Icon } from "lucide-react";

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
