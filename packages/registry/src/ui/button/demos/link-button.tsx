import { LogInIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
