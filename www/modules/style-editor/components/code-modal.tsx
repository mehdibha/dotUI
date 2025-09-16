"use client";

// import convert from "npm-to-yarn";
import { useWatch } from "react-hook-form";

import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import type { DialogRootProps } from "@dotui/ui/components/dialog";

import { useStyleEditorForm } from "../context/style-editor-provider";
import { useStyleEditorParams } from "../hooks/use-style-editor-params";

// import {
//   InstallTab,
//   InstallTabs,
// } from "@/modules/docs/components/install-tabs";
// import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

// const packageManagers: ("npm" | "pnpm" | "yarn" | "bun")[] = [
//   "npm",
//   "pnpm",
//   "yarn",
//   "bun",
// ];

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
        <DialogBody className="-mx-6 px-9 pb-8 pt-0">
          <div className="[&>h3]:step [&>h3]:text-fg-muted relative border-l pl-8 [counter-reset:step] [&>h3]:mt-4">
            <h3>Update your components.json</h3>
            <div className="">
              <pre className="bg-card mt-4 rounded-md border p-4 text-xs">
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
              <pre className="bg-card mt-4 rounded-md border p-4 text-xs">
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
