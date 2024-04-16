import { Button } from "@/lib/components/core/default/button";

export default function ButtonDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button variant="neutral">Button</Button>
      <Button variant="primary">Button</Button>
      <Button variant="ghost">Button</Button>
      <Button variant="outline">Button</Button>
      <Button variant="success">Button</Button>
      <Button variant="warning">Button</Button>
      <Button variant="danger">Button</Button>
    </div>
  );
}
