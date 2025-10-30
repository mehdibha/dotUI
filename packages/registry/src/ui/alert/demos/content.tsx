import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";

export default function AlertDemo() {
  return (
    <Alert>
      <AlertTitle>Payment Information</AlertTitle>
      <AlertDescription>
        Enter your payment method to complete your purchase.
      </AlertDescription>
    </Alert>
  );
}
