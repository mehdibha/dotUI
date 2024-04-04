import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/components/core/default/avatar";
import { AvatarGroup } from "@/lib/components/core/default/avatar-group";

export default function AvatarDemo() {
  return (
    <AvatarGroup>
      {[
        { name: "@mehdibha", src: "https://github.com/mehdibha.png" },
        { name: "@shadcn", src: "https://github.com/shadcn.png" },
        { name: "@leerob", src: "https://github.com/leerob.png" },
        { name: "@t3dotgg", src: "https://github.com/t3dotgg.png" },
        { name: "@joshwcomeau", src: "https://github.com/joshwcomeau.png" },
      ].map((user) => (
        <Avatar key={user.name}>
          <AvatarImage src={user.src} alt={user.name} />
          <AvatarFallback>{user.name[1]}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
