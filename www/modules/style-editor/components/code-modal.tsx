"use client";

// import convert from "npm-to-yarn";
import { useWatch } from "react-hook-form";

import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import type { DialogRootProps } from "@dotui/ui/components/dialog";

import { useStyleEditorForm } from "../context/style-editor-provider";

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
  const form = useStyleEditorForm();

  const visibility = useWatch({
    control: form.control,
    name: "visibility",
  });

  const styleName = useWatch({
    control: form.control,
    name: "name",
  });

  return (
    <DialogRoot {...props}>
      {children}
      <Dialog
        title="Install your style"
        description="Follow these steps to correctly install your style."
        modalProps={{
          className: "max-h-[530px] max-w-xl p-2",
        }}
      >
        <DialogBody className="-mx-6 px-6 pb-6 pt-0">
          <h3>Update your components.json</h3>
          <div>
            <pre className="mt-4 rounded-md border p-4 text-xs">
              <code>
                "style": "{visibility === "public" ? "mehdibha/" : ""}
                {styleName}",
              </code>
            </pre>
          </div>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
