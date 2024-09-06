import { LogInIcon } from "@/lib/icons";
import { Button } from "@/registry/ui/default/core/button";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
