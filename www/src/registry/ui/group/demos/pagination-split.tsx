"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";

export default function Demo() {
	return (
		<Group>
			<Group>
				<Button size="sm">1</Button>
				<Button size="sm">2</Button>
				<Button size="sm">3</Button>
				<Button size="sm">4</Button>
				<Button size="sm">5</Button>
			</Group>
			<Group>
				<Button size="xs" isIconOnly>
					<ArrowLeftIcon />
				</Button>
				<Button size="xs" isIconOnly>
					<ArrowRightIcon />
				</Button>
			</Group>
		</Group>
	);
}
