import { Button } from "@/registry/ui/default/core/button";
import { Skeleton } from "@/registry/ui/default/core/skeleton";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton>
        <Button>Button</Button>
      </Skeleton>
      <Skeleton show={false}>
        <Button>Button</Button>
      </Skeleton>
    </div>
  );
}
