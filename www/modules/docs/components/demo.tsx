import { highlight } from "fumadocs-core/highlight";

import { cn } from "@dotui/registry/lib/utils";
import { Index } from "@dotui/registry/ui/demos";

import { DemoTabs } from "@/modules/docs/components/demo-tabs";
import type { DemoControl } from "@/modules/docs/lib/component-controls";
import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { Pre } from "./code-block";

interface DemoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  controls?: DemoControl[];
}

async function Demo({ name, className, controls, ...props }: DemoProps) {
  const demoItem = Index[name];

  if (!demoItem) {
    return (
      <div
        className={cn(
          "mt-6 flex items-center gap-2 rounded-md border bg-card/80 p-6 [&>svg]:size-4",
          className,
        )}
        {...props}
      >
        Component{" "}
        <code className="rounded-sm border bg-neutral px-1.25 py-0.75 text-[0.8125rem] text-fg-muted">
          {name}
        </code>{" "}
        not found in registry.
      </div>
    );
  }

  const Component = demoItem.component;

  const filePath = demoItem.files[0];

  if (!filePath) {
    return (
      <div
        className={cn(
          "mt-6 flex items-center gap-2 rounded-md border bg-card/80 p-6 [&>svg]:size-4",
          className,
        )}
        {...props}
      >
        File path not found for component {name}.
      </div>
    );
  }

  const { content: rawCode, preview: rawPreview } =
    await getFileSource(filePath);
  const [highlightedCode, highlightedPreview] = await Promise.all([
    highlight(rawCode, {
      lang: "tsx",
      components: {
        pre: (props) => <Pre {...props} />,
      },
    }),
    highlight(rawPreview, {
      lang: "tsx",
      components: {
        pre: (props) => <Pre {...props} />,
      },
    }),
  ]);

  return (
    <DemoTabs
      className={className}
      component={<Component />}
      code={highlightedCode}
      codeSource={rawCode}
      preview={highlightedPreview}
      previewSource={rawPreview}
      controls={controls}
      {...props}
    />
  );
}

export { Demo };

export type { DemoProps };
