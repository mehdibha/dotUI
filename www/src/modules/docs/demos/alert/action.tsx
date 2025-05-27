import { Alert } from "@/components/dynamic-ui/alert";
import { Button } from "@/components/dynamic-ui/button";

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
