import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { InfoIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";
import type { ButtonProps } from "@dotui/ui/components/button";

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
