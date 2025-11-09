"use client";

import React from "react";

import { Button } from "@dotui/registry/ui/button";
import { toast } from "@dotui/registry/ui/toast";

export default function Page() {
  React.useEffect(() => {
    toast.add({
      title: "Success",
      description: "Operation completed successfully",
      variant: "success",
    });
  }, []);

  return (
    <Button
      onPress={() =>
        toast.add({
          title: "Success",
          description: "Operation completed successfully",
          variant: "success",
        })
      }
    >
      Show Toast
    </Button>
  );
}
