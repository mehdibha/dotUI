"use client";

import * as React from "react";
import { ProgressBar } from "@/components/dynamic-ui/progress-bar";

export default function Demo() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <ProgressBar aria-label="loading" value={progress} />;
}
