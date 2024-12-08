import { Button } from "@/components/dynamic-core/button";

export default function Demo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button size="sm" isPending>
        Button
      </Button>
      <Button size="md" isPending>
        Button
      </Button>
      <Button size="lg" isPending>
        Button
      </Button>
    </div>
  );
}
