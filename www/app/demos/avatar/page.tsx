import { Avatar, AvatarGroup } from "@dotui/registry/ui/avatar";

export default function Page() {
  return (
    <AvatarGroup>
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        alt="User 1"
        fallback="U1"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=2"
        alt="User 2"
        fallback="U2"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=3"
        alt="User 3"
        fallback="U3"
      />
    </AvatarGroup>
  );
}

