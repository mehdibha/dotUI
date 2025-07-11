"use client";

import {
  CodeIcon,
  RocketIcon,
  RotateCcwIcon,
  SettingsIcon,
} from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/ui/components/tabs";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export function StyleActions() {
  const { form } = useStyleForm();

  const handleReset = () => {
    form.reset();
  };

  const handleSubmit = () => {};

  return (
    <>
      <MenuRoot>
        <Button size="sm" shape="square">
          <SettingsIcon />
        </Button>
        <Menu>
          <MenuItem variant="danger">Delete style</MenuItem>
        </Menu>
      </MenuRoot>
      <DialogRoot>
        <Button size="sm" shape="square">
          <CodeIcon />
        </Button>
        <Dialog title="Install your style">
          <DialogBody>
            <Tabs>
              <TabList>
                <Tab id="cli">CLI</Tab>
                <Tab id="manual">Manual</Tab>
              </TabList>
              <TabPanel id="cli" className="mt-4">
                <div className="ml-4 border-l pl-8 text-sm text-fg-muted [counter-reset:step] [&>h3]:step [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-fg">
                  <h3>Init your style</h3>
                  <div>
                    init it with the following command:
                    <pre>
                      <code>
                        npx dotui style install {form.getValues("name")}
                      </code>
                    </pre>
                  </div>
                  <h3>Update your layout</h3>
                  <div>
                    init it with the following command:
                    <pre>
                      <code>
                        npx dotui style install {form.getValues("name")}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabPanel>
              <TabPanel id="manual"></TabPanel>
            </Tabs>
          </DialogBody>
        </Dialog>
      </DialogRoot>
      <Button
        size="sm"
        prefix={<RotateCcwIcon />}
        isDisabled={!form.formState.isDirty}
        onPress={handleReset}
      >
        Reset
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        prefix={<RocketIcon />}
        isDisabled={!form.formState.isDirty}
        className="border border-bg-primary hover:border-bg-primary-hover"
      >
        Publish
      </Button>
    </>
  );
}
