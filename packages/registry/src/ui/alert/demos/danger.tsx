import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";
import { AlertCircleIcon } from "@dotui/registry/icons";

export default function Demo() {
  return (
    <Alert variant="danger">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to save changes. Please check your connection and try again.
      </AlertDescription>
    </Alert>
  );
}

