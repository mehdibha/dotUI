import { LogInIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
