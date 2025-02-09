import { GlobeIcon } from "lucide-react";
import { Alert } from "@/components/dynamic-core/alert";

export default function AlertDemo() {
  return <Alert icon={<GlobeIcon />} title="Hello world" />;
}
