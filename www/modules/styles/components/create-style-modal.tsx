import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextField } from "@dotui/ui/components/text-field";

export function CreateStyleModal({ children }: { children: React.ReactNode }) {
  const form = useForm({
    defaultValues: {
      preset: "minimalist",
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <DialogRoot>
      {children}
      <Dialog modalProps={{ className: "max-w-lg" }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogHeading>New style</DialogHeading>
          </DialogHeader>
          <DialogBody className="space-y-6 text-sm">
            <div className="flex items-center gap-2">
              <FormControl
                name="preset"
                control={form.control}
                render={({ value, onChange, ...props }) => (
                  <Select
                    label="Style preset"
                    selectedKey={value}
                    onSelectionChange={onChange}
                    {...props}
                  >
                    <SelectItem id="minimalist">Minimalist</SelectItem>
                  </Select>
                )}
              />
              <FormControl
                name="name"
                control={form.control}
                render={(props) => (
                  <TextField label="Name" className="w-full" {...props} />
                )}
              />
            </div>
            <div className="space-y-2">
              <p className="text-fg-muted">
                You can install later with this command:
              </p>
              <pre className="bg-bg-neutral rounded-md border p-4 text-xs">
                <code className="truncate max-sm:flex max-sm:max-w-[60vw]">
                  <span className="text-[#F69D50]">npx</span> shadcn@latest init
                  https://dotui.org/r/
                  <span className="text-[#F69D50]">brutalist</span>
                  /base
                </code>
              </pre>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="primary">Create</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </DialogRoot>
  );
}
