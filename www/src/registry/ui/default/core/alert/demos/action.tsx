import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";

export default function AlertDemo() {
  return (
    <Alert
      action={
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      }
    >
      You are currently on the free plan. Upgrade to unlock more features.
    </Alert>
  );
}
