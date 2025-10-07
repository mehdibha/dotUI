import { Badge } from "@dotui/registry-v2/ui/badge";

export function BadgeDemo() {
  return (["sm", "md", "lg"] as const).map((size) => (
    <div key={size} className="flex flex-wrap gap-2">
      <Badge size={size}>default</Badge>
      <Badge size={size} variant="neutral">
        neutral
      </Badge>
      <Badge size={size} variant="accent">
        accent
      </Badge>
      <Badge size={size} variant="success">
        success
      </Badge>
      <Badge size={size} variant="warning">
        Badge
      </Badge>
      <Badge size={size} variant="info">
        info
      </Badge>
      <Badge size={size} variant="danger">
        danger
      </Badge>
    </div>
  ));
}
