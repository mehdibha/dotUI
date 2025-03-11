"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";

export default function Demo() {
  const [isPending, setPending] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-center gap-2">
        <Button size="sm" isPending>
          Button
        </Button>
        <Button size="md" isPending>
          Button
        </Button>
        <Button size="lg" isPending>
          Button
        </Button>
      </div>
      <Button
        isPending={isPending}
        onPress={() => {
          setPending(true);
          setTimeout(() => setPending(false), 2000);
        }}
      >
        Click me
      </Button>
    </div>
  );
}
