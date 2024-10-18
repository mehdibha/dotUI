"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import {
  Dialog,
  DialogFooter,
  DialogRoot,
} from "@/registry/ui/default/core/dialog";
import { TextField } from "@/registry/ui/default/core/text-field";

export const CreateThemeDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Create new theme">
        {({ close }) => (
          <>
            <TextField label="Name" className="w-full" />
            <DialogFooter>
              <Button variant="outline" size="sm" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onPress={() => {
                  close();
                }}
              >
                Save theme
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
};
