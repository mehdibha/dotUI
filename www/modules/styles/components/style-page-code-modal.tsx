"use client";

import { CodeIcon } from "lucide-react";
import convert from "npm-to-yarn";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/ui/components/tabs";

import {
  InstallTab,
  InstallTabs,
} from "@/modules/docs/components/install-tabs";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";

const packageManagers: ("npm" | "pnpm" | "yarn" | "bun")[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

export function StylePageCodeModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { form } = useStyleForm();

  return (
    <DialogRoot>
      {children}
      <Dialog
        title="Install your style"
        description="Follow these steps to correctly install your style."
        modalProps={{
          className: "max-h-[530px] max-w-xl p-2",
        }}
      >
        <DialogBody className="-mx-6 px-6 pb-6 pt-0">
          <div className="text-fg-muted [&>h3]:step [&>h3]:text-fg [&>h3]:not-first:mt-4 relative ml-4 border-l pl-8 text-sm [counter-reset:step] [&>h3]:text-base [&>h3]:font-bold">
            <h3>Init your style</h3>
            <div>
              <InstallTabs items={packageManagers}>
                {packageManagers.map((packageManager) => (
                  <InstallTab key={packageManager} value={packageManager}>
                    <pre className="p-4">
                      <code>
                        {convert(`npx shadcn@latest init`, packageManager)}{" "}
                        @dotui/
                        <span className="text-[#F69D50]">
                          {form.watch("slug")}
                        </span>
                        /base
                      </code>
                    </pre>
                  </InstallTab>
                ))}
              </InstallTabs>
            </div>
            <h3>You can now add your components</h3>
            <div>
              <p>
                For example, to add the button component, you can run the
                following command:
              </p>
              <InstallTabs items={packageManagers}>
                {packageManagers.map((packageManager) => (
                  <InstallTab key={packageManager} value={packageManager}>
                    <pre className="p-4">
                      <code>
                        {convert(`npx shadcn@latest add`, packageManager)}
                        @dotui/
                        <span className="text-[#F69D50]">
                          {form.watch("slug")}
                        </span>/button
                      </code>
                    </pre>
                  </InstallTab>
                ))}
              </InstallTabs>
            </div>
            <h3>You're done!</h3>
          </div>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
