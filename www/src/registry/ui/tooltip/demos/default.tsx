import { SquarePenIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button isIconOnly>
				<SquarePenIcon />
			</Button>
			<TooltipContent>
				Create new issue <Kbd>C</Kbd>
			</TooltipContent>
		</Tooltip>
	);
}
