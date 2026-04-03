import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";

export default function Demo() {
	return (
		<Avatar>
			<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
			<AvatarFallback>M</AvatarFallback>
			<Badge variant="primary" size="sm" className="-top-1.5 -right-1.5 rounded-full">
				6
			</Badge>
		</Avatar>
	);
}
