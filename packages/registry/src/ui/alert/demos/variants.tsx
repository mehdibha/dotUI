

import { Alert } from "@dotui/registry/ui/alert";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Alert
        variant="neutral"
        title="This is a neutral alert"
        className="col-span-2"
      />
      <Alert variant="info" title="This is an info alert" />
      <Alert variant="danger" title="This is a critical alert" />
      <Alert variant="warning" title="This is a warning alert" />
      <Alert variant="success" title="This is a success alert" />
    </div>
  );
}
