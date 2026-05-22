import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";

export default function Demo() {
	return (
		<div className="flex items-center gap-2">
			<Avatar className="rounded-full">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
			<Avatar className="rounded-lg">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
			<Avatar className="rounded-md">
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
		</div>
	);
}
