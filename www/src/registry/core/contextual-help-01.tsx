import { InfoIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/registry/core/button-01";
import { DialogRoot, Dialog } from "@/registry/core/dialog-01";

interface ContextualHelpProps {
  title?: string;
  description?: string;
  variant?: "info" | "help";
}

const ContextualHelp = ({
  title,
  description,
  variant,
}: ContextualHelpProps) => {
  const icon = variant === "info" ? <InfoIcon /> : <HelpCircleIcon />;
  return (
    <DialogRoot>
      <Button
        slot={null}
        aria-label={variant}
        variant="quiet"
        size="sm"
        shape="square"
        className="size-6"
      >
        {icon}
      </Button>
      <Dialog
        type="popover"
        mobileType="modal"
        title={title}
        description={description}
      />
    </DialogRoot>
  );
};

export { ContextualHelp };
