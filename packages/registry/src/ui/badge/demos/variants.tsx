import { Badge } from "@dotui/registry/ui/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge variant="neutral">neutral</Badge>
      <Badge variant="accent">accent</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="danger">danger</Badge>
      <Badge variant="warning">warning</Badge>
      <Badge variant="info">info</Badge>
    </div>
  );
}
