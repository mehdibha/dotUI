import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { LinkButton } from "@dotui/registry/ui/button";
import { Group } from "@dotui/registry/ui/group";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

type Neighbours = {
	previous?: { name: string; path: string };
	next?: { name: string; path: string };
};

export function DocsPager({ neighbours }: { neighbours: Neighbours }) {
	const { previous, next } = neighbours;

	return (
		<Group>
			<Tooltip>
				<LinkButton
					aria-label="Go to previous page"
					size="sm"
					isDisabled={!previous}
					href={previous ? { to: "/docs/$", params: { _splat: previous.path } } : undefined}
				>
					<ChevronLeftIcon />
				</LinkButton>
				<TooltipContent>{previous?.name}</TooltipContent>
			</Tooltip>
			<Tooltip>
				<LinkButton
					aria-label="Go to next page"
					size="sm"
					isDisabled={!next}
					href={next ? { to: "/docs/$", params: { _splat: next.path } } : undefined}
				>
					<ChevronRightIcon />
				</LinkButton>
				<TooltipContent>{next?.name}</TooltipContent>
			</Tooltip>
		</Group>
	);
}
