import { highlight } from "fumadocs-core/highlight";

import { cn } from "@dotui/registry/lib/utils";
import { Index } from "@dotui/registry/ui/demos";

import type { ComponentPreviewControl } from "@/modules/docs/components/component-preview-tabs";
import { ComponentPreviewTabs } from "@/modules/docs/components/component-preview-tabs";
import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { Pre } from "./code-block";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  controls?: ComponentPreviewControl[];
}

async function ComponentPreview({
  name,
  className,
  controls,
  ...props
}: ComponentPreviewProps) {
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

  if (controls) {
    return (
      <ComponentPreviewTabs
        className={className}
        component={<Component />}
        controls={controls}
        {...props}
      />
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
    <ComponentPreviewTabs
      className={className}
      component={<Component />}
      code={highlightedCode}
      preview={highlightedPreview}
      {...props}
    />
  );
}

export { ComponentPreview };

export type { ComponentPreviewProps };
