import { InfoIcon } from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { DialogProps } from "@dotui/registry/ui/dialog";

export function ContextualHelp({
  children,
  className,
  dialogProps,
  ...props
}: Omit<ButtonProps, "children"> & {
  children: React.ReactNode;
  dialogProps?: DialogProps;
}) {
  return (
    <DialogRoot>
      <Button
        size="sm"
        shape="circle"
        variant="quiet"
        className={cn("size-6 [&_svg]:size-3", className)}
        {...props}
      >
        <InfoIcon />
      </Button>
      <Dialog
        type="popover"
        mobileType="drawer"
        {...dialogProps}
        popoverProps={{
          placement: "top",
          ...dialogProps?.popoverProps,
          className: cn("max-w-64", dialogProps?.popoverProps?.className),
        }}
      >
        {children}
      </Dialog>
    </DialogRoot>
  );
}
