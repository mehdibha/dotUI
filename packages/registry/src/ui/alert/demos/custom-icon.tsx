import { GlobeIcon } from "@dotui/registry/icons";
import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";

export default function Demo() {
  return (
    <Alert>
      <GlobeIcon />
      <AlertTitle>Hello world</AlertTitle>
      <AlertDescription>This is a custom icon alert.</AlertDescription>
    </Alert>
  );
}
