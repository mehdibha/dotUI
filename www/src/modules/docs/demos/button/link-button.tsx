import { Button } from "@/components/dynamic-ui/button";
import { LogInIcon } from "lucide-react";

export default function Demo() {
  return (
    <Button href="/login" prefix={<LogInIcon />} target="_blank">
      Login
    </Button>
  );
}
