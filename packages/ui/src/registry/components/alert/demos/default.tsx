import { Alert } from "@dotui/ui/components/alert";
import { Button } from "@dotui/ui/components/button";

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
