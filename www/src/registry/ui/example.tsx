import type React from "react";

export function Example({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-lg flex-col gap-1 self-stretch lg:max-w-none">
      <h3 className="px-1.5 py-2 font-medium text-fg-muted text-xs">{title}</h3>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-fg *:[div:not([class*='w-'])]:w-full">
        {children}
      </div>
    </div>
  );
}
