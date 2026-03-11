import { Avatar, AvatarBadge, AvatarFallback, AvatarImage, AvatarPlaceholder } from "@dotui/registry/ui/avatar";

export default function Demo() {
	return (
		<Avatar>
			<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
			<AvatarFallback>M</AvatarFallback>
			<AvatarPlaceholder />
			<AvatarBadge className="top-0 bg-success" />
		</Avatar>
	);
}
