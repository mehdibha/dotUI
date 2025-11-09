import { Avatar, AvatarGroup } from "@dotui/registry/ui/avatar";

export default function Page() {
  return (
    <div className="flex items-center gap-6">
      <Avatar fallback="M" />
      <Avatar src="https://github.com/mehdibha.png" alt="User 1" fallback="M" />
      <AvatarGroup>
        <Avatar
          src="https://github.com/shadcn.png"
          alt="User 1"
          fallback="U1"
        />
        <Avatar
          src="https://github.com/devongovett.png"
          alt="User 2"
          fallback="U2"
        />
        <Avatar
          src="https://github.com/rauchg.png"
          alt="User 3"
          fallback="U3"
        />
      </AvatarGroup>
    </div>
  );
}
