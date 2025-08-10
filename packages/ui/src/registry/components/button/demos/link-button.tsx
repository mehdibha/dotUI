import { Button } from "@dotui/ui/components/button";
import { LogInIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
