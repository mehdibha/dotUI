import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      href="/docs/changelog"
      className="h-7 rounded-full text-xs text-fg-muted bg-neutral/50"
    >
      Introducing a dynamic shadcn registry
    </Button>
  );
}
