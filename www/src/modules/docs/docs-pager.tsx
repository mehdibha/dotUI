import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { LinkButton } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

type Neighbours = {
	previous?: { name: string; path: string };
	next?: { name: string; path: string };
};

export function DocsPager({ neighbours }: { neighbours: Neighbours }) {
	const { previous, next } = neighbours;
	const hrefFor = (path: string) => `/docs/${path}`;

	return (
		<Group>
			<Tooltip>
				<LinkButton
					aria-label="Go to previous page"
					size="sm"
					isIconOnly
					isDisabled={!previous}
					href={previous ? hrefFor(previous.path) : undefined}
				>
					<ChevronLeftIcon />
				</LinkButton>
				<TooltipContent>{previous?.name}</TooltipContent>
			</Tooltip>
			<Tooltip>
				<LinkButton
					aria-label="Go to next page"
					size="sm"
					isIconOnly
					isDisabled={!next}
					href={next ? hrefFor(next.path) : undefined}
				>
					<ChevronRightIcon />
				</LinkButton>
				<TooltipContent>{next?.name}</TooltipContent>
			</Tooltip>
		</Group>
	);
}
