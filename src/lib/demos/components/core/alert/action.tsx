import { Alert } from "@/lib/components/core/default/alert";
import { Button } from "@/lib/components/core/default/button";

export default function AlertDemo() {
  return (
    <Alert
      action={
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      }
    >
      This note details some information.
    </Alert>
  );
}
