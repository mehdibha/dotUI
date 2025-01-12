import { Badge } from "@/registry/core/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="success-subtle">Success Subtle</Badge>
      <Badge variant="success-outline">Success Outline</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="danger-subtle">Danger Subtle</Badge>
      <Badge variant="danger-outline">Danger Outline</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="warning-subtle">Warning Subtle</Badge>
      <Badge variant="warning-outline">Warning Outline</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="accent-subtle">Accent Subtle</Badge>
      <Badge variant="accent-outline">Accent Outline</Badge>
    </div>
  );
}

const Flex = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="flex items-center gap-2" />
);
