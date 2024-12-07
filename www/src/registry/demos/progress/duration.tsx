"use client";

import * as React from "react";
import { RotateCwIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { Progress } from "@/components/dynamic-core/progress";

export default function Demo() {
  const [key, setKey] = React.useState(0);
  const restart = () => setKey((prev) => prev + 1);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Button prefix={<RotateCwIcon />} onPress={restart}>
        Restart animation
      </Button>
      <Progress key={key} duration="30s" aria-label="Loading" />
    </div>
  );
}
