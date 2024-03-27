"use client";

import * as React from "react";
import { Progress } from "@/lib/components/core/default/progress";

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setProgress(13), 800);
    const timer2 = setTimeout(() => setProgress(66), 1700);
    const timer3 = setTimeout(() => setProgress(100), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return <Progress value={progress} className="w-[60%]" />;
}
