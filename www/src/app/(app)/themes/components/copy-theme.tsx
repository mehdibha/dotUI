import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";

export const CopyThemeDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Copy theme">
        <p>code here</p>
      </Dialog>
    </DialogRoot>
  );
};
