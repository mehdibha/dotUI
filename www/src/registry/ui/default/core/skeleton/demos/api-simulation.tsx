"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { Skeleton } from "@/registry/ui/default/core/skeleton";

export default function Demo() {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const apiCall = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 4000);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Button isLoading={status === "loading"} onPress={apiCall}>
        Simulate API Call
      </Button>
      <Skeleton show={status === "loading"}>
        <p>Some text loaded from API.</p>
      </Skeleton>
    </div>
  );
}
