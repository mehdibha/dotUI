"use client";

import { Button } from "@/lib/components/core/default/button";
import { ToastAction } from "@/lib/components/core/default/toast";
import { useToast } from "@/lib/components/core/default/use-toast";

export default function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
        });
      }}
    >
      Add to calendar
    </Button>
  );
}
