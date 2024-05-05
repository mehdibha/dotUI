import { Avatar, AvatarGroup } from "@/lib/components/core/default/avatar";

export default function AvatarDemo() {
  return (
    <AvatarGroup>
      {[
        { name: "@mehdibha", src: "https://github.com/mehdibha.png" },
        { name: "@shadcn", src: "https://github.com/shadcn.png" },
        { name: "@leerob", src: "https://github.com/leerob.png" },
        { name: "@t3dotgg", src: "https://github.com/t3dotgg.png" },
        {
          name: "@joshwcomeau",
          src: "https://github.com/joshwcomeau.png",
        },
      ].map((user) => (
        <Avatar
          key={user.name}
          src={user.src}
          alt={user.name}
          fallback={user.name[1].toUpperCase()}
        />
      ))}
    </AvatarGroup>
  );
}
