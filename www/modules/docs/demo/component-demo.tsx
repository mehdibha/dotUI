import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

import type { DemoControl } from "@/modules/docs/component-controls";
import { DemoShell } from "./demo-shell.client";
import { loadDemoPayload } from "./load-demo-payload.server";

interface ComponentDemoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  controls?: DemoControl[];
}

const errorContainerClassName =
  "mt-6 flex items-center gap-2 rounded-md border bg-card/80 p-6 [&>svg]:size-4";

export async function ComponentDemo({
  name,
  controls,
  className,
  ...props
}: ComponentDemoProps) {
  const payload = await loadDemoPayload(name, controls);

  if (payload.status === "error") {
    return (
      <div className={cn(errorContainerClassName, className)} {...props}>
        {payload.code === "not-found" ? (
          <>
            Component{" "}
            <code className="rounded-sm border bg-neutral px-1.25 py-0.75 text-[0.8125rem] text-fg-muted">
              {name}
            </code>{" "}
            not found in registry.
          </>
        ) : (
          payload.message
        )}
      </div>
    );
  }

  return (
    <DemoShell
      className={className}
      component={payload.component}
      highlightedCode={payload.highlightedCode}
      codeSource={payload.codeSource}
      highlightedPreview={payload.highlightedPreview}
      previewSource={payload.previewSource}
      controls={controls}
      {...props}
    />
  );
}

export type { ComponentDemoProps };
