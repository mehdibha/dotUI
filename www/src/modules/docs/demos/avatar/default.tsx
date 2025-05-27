import { Avatar } from "@/components/dynamic-ui/avatar";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/mehdibha.png"
        alt="@mehdibha"
        fallback="M"
      />
      <Avatar
        src="https://githubbb.com/mehdibha.png" // invalid URL to trigger fallback
        alt="@mehdibha"
        fallback="M"
      />
    </div>
  );
}
