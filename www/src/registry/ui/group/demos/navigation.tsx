"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";

export default function Demo() {
	return (
		<Group>
			<Group>
				<Button isIconOnly>
					<ArrowLeftIcon />
				</Button>
				<Button isIconOnly>
					<ArrowRightIcon />
				</Button>
			</Group>
			<Group aria-label="Single navigation button">
				<Button isIconOnly>
					<ArrowLeftIcon />
				</Button>
			</Group>
		</Group>
	);
}
