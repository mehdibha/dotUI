import React from "react";
import { User2Icon } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarPlaceholder,
  AvatarRoot,
} from "@dotui/ui/components/avatar";

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
