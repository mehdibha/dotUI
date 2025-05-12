"use client";

import { useMounted } from "@/hooks/use-mounted";
import { CurrentStyleProvider } from "@/modules/styles/components/current-syle-provider";

export default function InternalPage() {
  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <div>
      <h1>Internal page</h1>

      <CurrentStyleProvider>
        <div className="bg-bg text-fg flex size-80 items-center justify-center">
          Hello world
        </div>
      </CurrentStyleProvider>
    </div>
  );
}
