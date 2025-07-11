"use client";

import {
  CodeIcon,
  CopyIcon,
  EllipsisIcon,
  Globe2Icon,
  LockIcon,
  PencilIcon,
  RocketIcon,
  RotateCcwIcon,
  SaveIcon,
  StarIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";
import convert from "npm-to-yarn";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/ui/components/tabs";
import { TextField } from "@dotui/ui/components/text-field";
import { Tooltip } from "@dotui/ui/components/tooltip";

import {
  InstallTab,
  InstallTabs,
} from "@/modules/docs/components/install-tabs";
import { useStyleForm } from "@/modules/styles/lib/form-context";

const packageManagers: ("npm" | "pnpm" | "yarn" | "bun")[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

export function StyleActions() {
  const { form } = useStyleForm();

  const handleReset = () => {
    form.reset();
  };

  const isUserStyle = true;

  return (
    <>
      <DialogRoot>
        <Button size="sm" prefix={<CodeIcon />}>
          Code
        </Button>
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
                        <InstallTab value={packageManager}>
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
                        <InstallTab value={packageManager}>
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
                        <InstallTab value={packageManager}>
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
      <Tooltip content="Reset" delay={0}>
        <Button
          size="sm"
          shape="square"
          isDisabled={!form.formState.isDirty}
          onPress={handleReset}
        >
          <RotateCcwIcon />
        </Button>
      </Tooltip>
      {isUserStyle ? (
        <Button
          type="submit"
          variant="primary"
          size="sm"
          prefix={<SaveIcon />}
          isDisabled={!form.formState.isDirty}
          className="border border-bg-primary hover:border-bg-primary-hover"
        >
          Save
        </Button>
      ) : (
        <DialogRoot>
          <Button
            size="sm"
            variant="primary"
            isDisabled={!form.formState.isDirty}
            className="border border-bg-primary hover:border-bg-primary-hover"
            prefix={<RocketIcon />}
          >
            Publish
          </Button>
          <Dialog
            title="Publish your style"
            description="Follow these steps to correctly publish your style."
          >
            <DialogBody className="-mx-6 space-y-2 px-6 pt-1 [&_[data-slot='label']]:text-sm">
              <TextField
                label="Name"
                defaultValue="Minimalist"
                className="w-full"
              />
              <TextField
                label="slug"
                defaultValue="minimalist"
                className="w-full"
              />
              <Select
                aria-label="Visibility"
                defaultSelectedKey="public"
                className="w-full"
              >
                <SelectItem id="public" prefix={<Globe2Icon />}>
                  Public
                </SelectItem>
                <SelectItem id="private" isDisabled prefix={<LockIcon />}>
                  Private
                </SelectItem>
              </Select>
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Publish
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogRoot>
      )}
      <MenuRoot>
        <Button size="sm" shape="square">
          <EllipsisIcon />
        </Button>
        <Menu
          overlayProps={{
            popoverProps: {
              placement: "bottom right",
            },
          }}
        >
          <MenuItem prefix={<CopyIcon />}>Clone</MenuItem>
          {isUserStyle && (
            <>
              <MenuItem prefix={<StarIcon />}>Favorite</MenuItem>
              <MenuItem prefix={<PencilIcon />}>Rename</MenuItem>
              <MenuItem variant="danger" prefix={<Trash2Icon />}>
                Delete style
              </MenuItem>
            </>
          )}
        </Menu>
      </MenuRoot>
    </>
  );
}
