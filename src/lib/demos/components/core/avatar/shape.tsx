import { Avatar } from "@/lib/components/core/default/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center space-x-6">
      <Avatar src="https://github.com/mehdibha.png" alt="@mehdibha" fallback="M" shape="square" />
      <Avatar src="https://github.com/mehdibha.png" alt="@mehdibha" fallback="M" shape="circle" />
    </div>
  );
}
