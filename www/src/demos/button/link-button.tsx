import { Button } from "@/components/dynamic-core/button";
import { LogInIcon } from "@/__icons__";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}