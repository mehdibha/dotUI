import { SquarePenIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button>
				<SquarePenIcon />
			</Button>
			<TooltipContent
			// variant="inverse"
			>
				Create new issue
			</TooltipContent>
		</Tooltip>
	);
}
