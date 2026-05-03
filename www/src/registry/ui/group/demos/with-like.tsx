"use client";

import { HeartIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";

export default function Demo() {
	return (
		<Group>
			<Button>
				<HeartIcon />
				Like
			</Button>
			<Button>1.2K</Button>
		</Group>
	);
}
