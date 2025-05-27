"use client";

import { useMounted } from "@/hooks/use-mounted";
import { FontSelector } from "@/modules/styles/components/font-selector";

// import { CurrentStyleProvider } from "@/modules/styles/components/current-style-provider";

export default function InternalPage() {
  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <div>
      <h1>Internal page</h1>

      <div style={{}}>
        <div className="bg-bg-accent size-10" />
      </div>
      <FontSelector label="Font" font={null} onFontChange={() => {}} />
    </div>
  );
}
