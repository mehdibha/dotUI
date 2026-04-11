import { PlusIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button size="icon">
				<PlusIcon />
			</Button>
			<TooltipContent hideArrow>Add to library</TooltipContent>
		</Tooltip>
	);
}
