import { Alert } from "@/components/dynamic-ui/alert";
import { GlobeIcon } from "lucide-react";

export default function AlertDemo() {
  return <Alert icon={<GlobeIcon />} title="Hello world" />;
}
