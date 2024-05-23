"use client";

import { HelpCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { toast } from "@/lib/components/core/default/toast";

export default function ToastDemo() {
  return (
    <Button onPress={() => toast("Why this is happening?", { icon: <HelpCircleIcon /> })}>
      Show toast
    </Button>
  );
}
