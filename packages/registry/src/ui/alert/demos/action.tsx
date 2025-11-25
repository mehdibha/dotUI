import { Alert, AlertAction, AlertTitle } from "@dotui/registry/ui/alert";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <Alert>
      <AlertTitle>
        You are currently on the free plan. Upgrade to unlock more features.
      </AlertTitle>
      <AlertAction>
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      </AlertAction>
    </Alert>
  );
}
