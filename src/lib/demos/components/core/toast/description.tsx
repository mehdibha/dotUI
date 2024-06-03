"use client";

import { Button } from "@/lib/components/core/default/button";
import { toast } from "@/lib/components/core/default/toast";

export default function ToastDemo() {
  return (
    <Button
      onPress={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        })
      }
    >
      Show toast
    </Button>
  );
}
