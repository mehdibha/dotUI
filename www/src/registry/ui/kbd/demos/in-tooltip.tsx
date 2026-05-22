import { SaveIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo() {
	return (
		<Tooltip>
			<Button isIconOnly size="sm">
				<SaveIcon />
			</Button>
			<TooltipContent>
				<div className="flex items-center gap-2">
					Save Changes <Kbd>S</Kbd>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
