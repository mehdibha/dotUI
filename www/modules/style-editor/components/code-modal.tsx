"use client";

import { Dialog, DialogBody, DialogRoot } from "@dotui/registry/ui/dialog";
import type { DialogRootProps } from "@dotui/registry/ui/dialog";

import { useStyleEditorParams } from "../hooks/use-style-editor-params";

export function CodeModal({ children, ...props }: DialogRootProps) {
  const { slug } = useStyleEditorParams();

  return (
    <DialogRoot {...props}>
      {children}
      <Dialog
        title="Install your style with shadcn CLI"
        description="Follow these steps to correctly install your style."
        modalProps={{
          className: "max-h-[530px] max-w-xl p-0",
        }}
        className="pb-0"
      >
        <DialogBody className="-mx-6 px-9 pt-0 pb-8">
          <div className="relative border-l pl-8 [counter-reset:step] [&>h3]:step [&>h3]:mt-4 [&>h3]:text-fg-muted">
            <h3>Update your components.json</h3>
            <div className="">
              <pre className="mt-4 rounded-md border bg-card p-4 text-xs">
                <code>
                  {`"style": "${slug}",
"registries": {
  "@dotui": "https://dotui.org/r/{style}/{name}"
}`}
                </code>
              </pre>
            </div>
            <h3>Init your style</h3>
            <div>
              <pre className="mt-4 rounded-md border bg-card p-4 text-xs">
                <code>pnpm dlx shadcn@latest add @dotui/base</code>
              </pre>
            </div>
            <h3>You're done!</h3>
          </div>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
