"use client";

import * as React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { ProgressBar } from "@/components/dynamic-ui/progress-bar";
import { RotateCwIcon } from "lucide-react";

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
