import { InfoIcon } from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import type { ButtonProps } from "@dotui/registry/ui/button";

export function ContextualHelp({
  children,
  className,
  ...props
}: Omit<ButtonProps, "children"> & { children: React.ReactNode }) {
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
        popoverProps={{ placement: "top", className: "max-w-64" }}
      >
        {children}
      </Dialog>
    </DialogRoot>
  );
}
