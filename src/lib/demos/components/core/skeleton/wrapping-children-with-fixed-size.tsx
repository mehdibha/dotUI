import { Button } from "@/lib/components/core/default/button";
import { Skeleton } from "@/lib/components/core/default/skeleton";

export default function SkeletonDemo() {
  return (
    <Skeleton className="h-20 w-20">
      <Button>Button</Button>
    </Skeleton>
  );
}
