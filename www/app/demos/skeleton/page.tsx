import { Button } from "@dotui/registry/ui/button";
import { SkeletonProvider } from "@dotui/registry/ui/skeleton";

export default function Page() {
  return (
    <SkeletonProvider isLoading={true}>
      <Button>Button</Button>
    </SkeletonProvider>
  );
}
