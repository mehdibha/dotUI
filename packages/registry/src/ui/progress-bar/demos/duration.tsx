"use client";

import * as React from "react";

import { RotateCwIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { ProgressBar } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
  const [key, setKey] = React.useState(0);
  const restart = () => setKey((prev) => prev + 1);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Button prefix={<RotateCwIcon />} onPress={restart}>
        Restart animation
      </Button>
      <ProgressBar key={key} duration="30s" aria-label="Loading" />
    </div>
  );
}
