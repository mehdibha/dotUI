import { Button } from "@/components/dynamic-ui/button";
import { Skeleton } from "@/components/dynamic-ui/skeleton";

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
