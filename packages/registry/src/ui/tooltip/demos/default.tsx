import { SquarePenIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button>
				<SquarePenIcon />
			</Button>
			<TooltipContent>
				Create new issue <Kbd>C</Kbd>
			</TooltipContent>
		</Tooltip>
	);
}
