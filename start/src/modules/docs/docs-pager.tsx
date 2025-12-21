import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { LinkButton } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

type Neighbours = {
	previous?: { name: string; url: string };
	next?: { name: string; url: string };
};

export function DocsPager({ neighbours }: { neighbours: Neighbours }) {
	const { previous, next } = neighbours;

	return (
		<Group>
			<Tooltip>
				<LinkButton aria-label="Go to previous page" size="sm" isDisabled={!previous} href={previous?.url}>
					<ChevronLeftIcon />
				</LinkButton>
				<TooltipContent>{previous?.name}</TooltipContent>
			</Tooltip>
			<Tooltip>
				<LinkButton aria-label="Go to next page" size="sm" isDisabled={!next} href={next?.url}>
					<ChevronRightIcon />
				</LinkButton>
				<TooltipContent>{next?.name}</TooltipContent>
			</Tooltip>
		</Group>
	);
}
