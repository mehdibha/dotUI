import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLinkIcon, GlobeIcon, LockIcon } from "lucide-react";
import {  useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextField } from "@dotui/ui/components/text-field";

import { useCreateStyle } from "../hooks/use-create-style";

const createStyleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  preset: z.string().min(1, "Preset is required"),
  visibility: z.string().min(1, "Visibility is required"),
});

type CreateStyleFormData = z.infer<typeof createStyleSchema>;

export function CreateStyleModal({ children }: { children: React.ReactNode }) {
  const createStyleMutation = useCreateStyle();

  const form = useForm<CreateStyleFormData>({
    resolver: zodResolver(createStyleSchema),
    defaultValues: {
      preset: "minimalist",
      name: "",
      visibility: "unlisted",
    },
  });

  const onSubmit = (data: CreateStyleFormData) => {
    createStyleMutation.mutate(data);
  };

  return (
    <DialogRoot>
      {children}
      <Dialog modalProps={{ className: "max-w-lg" }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogHeading>Create a new style</DialogHeading>
          </DialogHeader>
          <DialogBody>
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
            <div className="flex items-end gap-2">
              <FormControl
                name="name"
                control={form.control}
                render={(props) => (
                  <TextField label="Name" autoFocus className="w-full" {...props} />
                )}
              />
              <FormControl
                name="visibility"
                control={form.control}
                render={({ value, onChange, ...props }) => (
                  <Select
                    aria-label="Visibility"
                    selectedKey={value}
                    onSelectionChange={onChange}
                    renderValue={({ selectedItem }) => (
                      <div className="flex items-center gap-2 [&>svg]:text-fg-muted">
                        {selectedItem?.icon}
                        {selectedItem?.label}
                      </div>
                    )}
                    items={[
                      {
                        value: "private",
                        label: "Private",
                        icon: <LockIcon />,
                        description: "Only you can view and access this style.",
                      },
                      {
                        value: "unlisted",
                        label: "Unlisted",
                        icon: <ExternalLinkIcon />,
                        description:
                          "Anyone with the link can access this style.",
                      },
                      {
                        value: "public",
                        label: "Public",
                        icon: <GlobeIcon />,
                        description: "Anyone can view this style.",
                      },
                    ]}
                    {...props}
                  >
                    {(item) => (
                      <SelectItem
                        id={item.value}
                        prefix={item.icon}
                        label={item.label}
                        textValue={item.value}
                        description={item.description}
                        className="[&>svg]:text-fg-muted!"
                      />
                    )}
                  </Select>
                )}
              />
            </div>
            <div className="mt-4 bg-transparent">
              <p className="text-sm text-fg-muted">
                You can install it later with this command:
              </p>
              <pre className="mt-1 rounded-md border bg-bg-neutral p-4 text-xs">
                <code className="truncate max-sm:flex max-sm:max-w-[60vw]">
                  <span className="text-[#F69D50]">npx</span> shadcn@latest init
                  https://dotui.org/r/
                  <span className="text-[#F69D50]">
                    {form.watch("name")
                      ? form
                          .watch("name")
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "") || "your-style"
                      : "{style-name}"}
                  </span>
                  /base
                </code>
              </pre>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button
              variant="primary"
              type="submit"
              isDisabled={createStyleMutation.isPending}
            >
              {createStyleMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </DialogRoot>
  );
}
