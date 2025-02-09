import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/components/core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
  DialogRootProps,
} from "@/components/core/dialog";
import { Form } from "@/components/core/form";

export const DeleteThemeDialog = ({
  children,
  ...props
}: Omit<DialogRootProps, "children"> & { children?: React.ReactNode }) => {
  const { deleteTheme, currentThemeId } = useThemes();
  return (
    <DialogRoot {...props}>
      {children}
      <Dialog
        role="alertdialog"
        title="Delete theme"
        description="Are you sure you want to delete this theme?"
      >
        {({ close }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              deleteTheme(currentThemeId);
              close();
            }}
          >
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  close();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm">
                Delete theme
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Dialog>
    </DialogRoot>
  );
};
