import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from "@/lib/components/core/default/avatar";

export default function AvatarDemo() {
  return (
    <AvatarRoot>
      <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
      <AvatarFallback delayMs={3000}>M</AvatarFallback>
    </AvatarRoot>
  );
}
