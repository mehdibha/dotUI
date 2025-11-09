import { Badge } from "@dotui/registry/ui/badge";

export default function Page() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Error</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  );
}

