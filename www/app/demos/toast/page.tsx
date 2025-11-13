"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { toast } from "@dotui/registry/ui/toast";

export default function Page() {
  React.useEffect(() => {
    toast.add({
      title: "Event has been created",
    });
  }, []);

  return (
    <div className="flex h-40 flex-col items-start">
      <Button
        onPress={() =>
          toast.add({
            title: "Event has been created",
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
