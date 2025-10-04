import { Alert } from "@dotui/registry/ui/alert";
import { Button } from "@dotui/registry/ui/button";

export default function AlertDemo() {
  return (
    <Alert
      title="Payment information"
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
