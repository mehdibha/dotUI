import { Button } from "@/lib/components/core/default/button";

export default function ButtonDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button isDisabled>Button</Button>
      <Button variant="outline" isDisabled>
        Button
      </Button>
    </div>
  );
}
