import { Dialog, DialogRoot } from "@/components/core/dialog";

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
