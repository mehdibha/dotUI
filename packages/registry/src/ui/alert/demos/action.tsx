import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@dotui/registry/ui/alert";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <Alert>
      <AlertTitle>Upgrade Required</AlertTitle>
      <AlertDescription>
        You are currently on the free plan. Upgrade to unlock more features.
      </AlertDescription>
      <AlertAction>
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      </AlertAction>
    </Alert>
  );
}
