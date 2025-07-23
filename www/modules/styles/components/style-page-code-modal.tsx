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
          className: "h-[400px] p-2",
        }}
      >
        <DialogBody className="-mx-6 px-6 pt-0 pb-6">
          <Tabs>
            <TabList>
              <Tab id="cli">CLI</Tab>
              <Tab id="manual">Manual</Tab>
            </TabList>
            <TabPanel id="cli" className="relative mt-4">
              <div className="ml-4 border-l pl-8 text-sm text-fg-muted [counter-reset:step] [&>h3]:step [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-fg [&>h3]:not-first:mt-4">
                <h3>Init your style</h3>
                <div>
                  <InstallTabs items={packageManagers}>
                    {packageManagers.map((packageManager) => (
                      <InstallTab key={packageManager} value={packageManager}>
                        <pre className="p-4">
                          <code>
                            {convert(
                              `npx shadcn@latest init https://dotui.org/r/${form.watch("slug")}/base`,
                              packageManager,
                            )}
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
                            {convert(
                              `npx shadcn@latest add https://dotui.org/r/${form.watch("slug")}/button`,
                              packageManager,
                            )}
                          </code>
                        </pre>
                      </InstallTab>
                    ))}
                  </InstallTabs>
                  <p>
                    To add all components, you can run the following command:
                  </p>
                  <InstallTabs items={packageManagers}>
                    {packageManagers.map((packageManager) => (
                      <InstallTab key={packageManager} value={packageManager}>
                        <pre className="p-4">
                          <code>
                            {convert(
                              `npx shadcn@latest add https://dotui.org/r/${form.watch("slug")}/all`,
                              packageManager,
                            )}
                          </code>
                        </pre>
                      </InstallTab>
                    ))}
                  </InstallTabs>
                </div>
                <h3>You're done!</h3>
              </div>
            </TabPanel>
            <TabPanel id="manual"></TabPanel>
          </Tabs>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
