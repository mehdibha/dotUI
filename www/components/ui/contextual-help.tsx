import { InfoIcon } from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { DialogContentProps } from "@dotui/registry/ui/dialog";

export function ContextualHelp({
  children,
  className,
  dialogProps,
  ...props
}: Omit<ButtonProps, "children"> & {
  children: React.ReactNode;
  dialogProps?: DialogContentProps;
}) {
  return (
    <Dialog>
      <Button
        size="sm"
        variant="quiet"
        className={cn("size-6 [&_svg]:size-3", className)}
        {...props}
      >
        <InfoIcon />
      </Button>
      <Popover placement="top">
        <DialogContent
          className={cn("max-w-64", dialogProps?.className)}
          {...dialogProps}
        >
          {children}
        </DialogContent>
      </Popover>
    </Dialog>
  );
}
