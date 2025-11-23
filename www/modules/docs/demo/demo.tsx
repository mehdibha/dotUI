import type React from "react";
import { highlight } from "fumadocs-core/highlight";

import { cn } from "@dotui/registry/lib/utils";
import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";
import type { DemoControl } from "@/modules/docs/component-controls";
import { getFileSource } from "@/modules/docs/get-file-source";
import { DemoShell } from "./demo.client";

interface DemoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  controls?: DemoControl[];
}

const errorContainerClassName =
  "mt-6 flex items-center gap-2 rounded-md border bg-card/80 p-6 [&>svg]:size-4";

const highlightSource = (source: string) =>
  highlight(source, {
    lang: "tsx",
    components: {
      pre: (props) => <Pre {...props} />,
    },
  });

export async function Demo({ name, controls, className, ...props }: DemoProps) {
  const renderError = (message: React.ReactNode) => (
    <div className={cn(errorContainerClassName, className)} {...props}>
      {message}
    </div>
  );

  const demoItem = Index[name];

  if (!demoItem) {
    return renderError(
      <>
        Component{" "}
        <code className="rounded-sm border bg-neutral px-1.25 py-0.75 text-[0.8125rem] text-fg-muted">
          {name}
        </code>{" "}
        not found in registry.
      </>,
    );
  }

  const filePath = demoItem.files[0];

  if (!filePath) {
    return renderError(`File path not found for component ${name}.`);
  }

  try {
    const Component = demoItem.component;

    const { content: rawCode, preview: rawPreview } =
      await getFileSource(filePath);

    const [highlightedCode, highlightedPreview] = await Promise.all([
      highlightSource(rawCode),
      highlightSource(rawPreview),
    ]);

    return (
      <DemoShell
        className={className}
        component={<Component />}
        highlightedCode={highlightedCode}
        codeSource={rawCode}
        highlightedPreview={highlightedPreview}
        previewSource={rawPreview}
        controls={controls}
        {...props}
      />
    );
  } catch (error) {
    return renderError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

export type { DemoProps };
