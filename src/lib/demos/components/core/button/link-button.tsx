import { LogInIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
