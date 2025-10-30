import { LogInIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";

export default function Demo() {
  return (
    <Button asChild>
      <a href="/login" target="_blank" rel="noopener">
        <LogInIcon />
        Login
      </a>
    </Button>
  );
}
