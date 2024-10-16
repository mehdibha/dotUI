import { Button } from "@/registry/ui/default/core/button";

export default function Demo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button size="sm" isLoading>
        Button
      </Button>
      <Button size="md" isLoading>
        Button
      </Button>
      <Button size="lg" isLoading>
        Button
      </Button>
    </div>
  );
}
