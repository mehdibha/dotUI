import { Alert, AlertTitle } from "@dotui/registry/ui/alert";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Alert variant="neutral" className="col-span-2">
        <AlertTitle>This is a neutral alert</AlertTitle>
      </Alert>
      <Alert variant="info">
        <AlertTitle>This is an info alert</AlertTitle>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>This is a critical alert</AlertTitle>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>This is a warning alert</AlertTitle>
      </Alert>
      <Alert variant="success">
        <AlertTitle>This is a success alert</AlertTitle>
      </Alert>
    </div>
  );
}
