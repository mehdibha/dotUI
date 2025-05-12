import { Button } from "@/components/dynamic-ui/button";
import { Skeleton } from "@/components/dynamic-ui/skeleton";

export default function Demo() {
  return (
    <Skeleton className="size-20">
      <Button>Button</Button>
    </Skeleton>
  );
}
