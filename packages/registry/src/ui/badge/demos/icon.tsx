import { BadgeCheck } from "lucide-react";

import { Badge } from "@dotui/registry/ui/badge";

export default function Demo() {
	return (
		<div className="flex items-center gap-2">
			<Badge>
				<BadgeCheck />
				Verified
			</Badge>
		</div>
	);
}
