import { Button } from "@/lib/components/core/default/button";

export default function ButtonDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button disabled>Button</Button>
      <Button variant="outline" disabled>
        Button
      </Button>
    </div>
  );
}
