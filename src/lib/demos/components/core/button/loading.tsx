import { Button } from "@/lib/components/core/default/button";

export default function ButtonLoadingDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button size="sm" loading>
        Button
      </Button>
      <Button size="md" loading>
        Button
      </Button>
      <Button size="lg" loading>
        Button
      </Button>
    </div>
  );
}
