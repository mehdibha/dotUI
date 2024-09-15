import { InfoIcon, HelpIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { DialogRoot, Dialog } from "@/registry/ui/default/core/dialog";

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
  const icon = variant === "info" ? <InfoIcon /> : <HelpIcon />;
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
