import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";
import { CheckCircle2Icon } from "@dotui/registry/icons";

export default function Demo() {
  return (
    <Alert variant="success">
      <CheckCircle2Icon />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  );
}

