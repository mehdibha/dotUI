"use client";

import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/registry/ui/default/core/button";
import {
  Dialog,
  DialogFooter,
  DialogRoot,
} from "@/registry/ui/default/core/dialog";
import { Form } from "@/registry/ui/default/core/form";
import { TextField } from "@/registry/ui/default/core/text-field";

export const CreateThemeDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [name, setName] = React.useState("");
  const { createTheme } = useThemes();

  return (
    <DialogRoot>
      {children}
      <Dialog title="Create new theme">
        {({ close }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              createTheme({ name });
              setName("");
              close();
            }}
          >
            <TextField
              autoFocus
              label="Name"
              isRequired
              value={name}
              onChange={setName}
              className="w-full"
            />
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  setName("");
                  close();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isDisabled={!name}
              >
                Create theme
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Dialog>
    </DialogRoot>
  );
};
