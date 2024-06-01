import { LogInIcon } from "lucide-react";
import { LinkButton } from "@/lib/components/core/default/button";

export default function Demo() {
  return (
    <LinkButton href="/login" prefix={<LogInIcon />}>
      Login
    </LinkButton>
  );
}
