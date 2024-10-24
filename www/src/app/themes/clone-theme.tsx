import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/registry/ui/default/core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
} from "@/registry/ui/default/core/dialog";
import { Form } from "@/registry/ui/default/core/form";
import { TextField } from "@/registry/ui/default/core/text-field";

export const CloneThemeDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [name, setName] = React.useState("");
  const { cloneTheme, currentThemeId } = useThemes();
  return (
    <DialogRoot>
      {children}
      <Dialog title="Clone theme">
        {({ close }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              cloneTheme(currentThemeId, { name });
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
                Save theme
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Dialog>
    </DialogRoot>
  );
};
