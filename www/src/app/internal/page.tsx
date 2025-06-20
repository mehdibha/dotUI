import { StyleProvider } from "@dotui/ui";
import { Alert } from "@dotui/ui/components/alert";
import { Button } from "@dotui/ui/components/button";

export default function InternalPage() {
  return (
    <div>
      <StyleProvider style={{ variants: { alert: "notch" } }}>
        <Alert title="Hello world" variant="danger" />
        <Button>Click me</Button>
      </StyleProvider>
    </div>
  );
}
