import { SaveIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button variant="default" isIconOnly aria-label="Save">
				<SaveIcon />
			</Button>
			<TooltipContent>
				Save changes <Kbd>S</Kbd>
			</TooltipContent>
		</Tooltip>
	);
}
