import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/components/core/default/avatar";

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
