"use client";

import convert from "npm-to-yarn";

import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import type { DialogRootProps } from "@dotui/ui/components/dialog";

import {
  InstallTab,
  InstallTabs,
} from "@/modules/docs/components/install-tabs";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

const packageManagers: ("npm" | "pnpm" | "yarn" | "bun")[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

export function CodeModal({ children, ...props }: DialogRootProps) {
  const { form } = useStyleForm();

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
                "style": "
                {form.watch("visibility") === "public" ? "mehdibha/" : ""}
                {form.watch("name")}",
              </code>
            </pre>
          </div>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
