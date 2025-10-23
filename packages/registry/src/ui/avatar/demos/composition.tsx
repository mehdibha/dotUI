

import { User2Icon } from "@dotui/registry/icons";
import {
  AvatarFallback,
  AvatarImage,
  AvatarPlaceholder,
  AvatarRoot,
} from "@dotui/registry/ui/avatar";

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
