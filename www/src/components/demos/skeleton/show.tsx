import { Button } from "@/components/dynamic-core/button";
import { Skeleton } from "@/components/dynamic-core/skeleton";

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
