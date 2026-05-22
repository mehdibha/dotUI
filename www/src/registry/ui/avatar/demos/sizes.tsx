import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";

export default function Demo() {
	return (
		<div className="flex items-center gap-2">
			<Avatar size="sm">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
			<Avatar size="md">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
		</div>
	);
}
