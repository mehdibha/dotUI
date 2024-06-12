import { InfoIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "./button";
import { PopoverRoot, Popover } from "./popover";

interface ContextualHelpProps {
  title?: string;
  description?: string;
  variant?: "info" | "help";
}

const ContextualHelp = ({
  title,
  description,
  variant,
  ...props
}: ContextualHelpProps) => {
  const icon = variant === "info" ? <InfoIcon /> : <HelpCircleIcon />;
  return (
    <PopoverRoot>
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
      <Popover title={title} description={description} placement="top" />
    </PopoverRoot>
  );
};

export { ContextualHelp };
