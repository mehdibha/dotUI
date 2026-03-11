import { Avatar, AvatarFallback, AvatarGroup, AvatarImage, AvatarPlaceholder } from "@dotui/registry/ui/avatar";

export function AvatarDemo() {
	return (
		<div className="flex items-center gap-4">
			<Avatar>
				<AvatarFallback>M</AvatarFallback>
				<AvatarPlaceholder />
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/mehdibha.png" alt="User 1" />
				<AvatarFallback>M</AvatarFallback>
				<AvatarPlaceholder />
			</Avatar>
			<AvatarGroup>
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
					<AvatarFallback>U1</AvatarFallback>
					<AvatarPlaceholder />
				</Avatar>
				<Avatar>
					<AvatarImage src="https://github.com/devongovett.png" alt="User 2" />
					<AvatarFallback>U2</AvatarFallback>
					<AvatarPlaceholder />
				</Avatar>
				<Avatar>
					<AvatarImage src="https://github.com/rauchg.png" alt="User 3" />
					<AvatarFallback>U3</AvatarFallback>
					<AvatarPlaceholder />
				</Avatar>
			</AvatarGroup>
		</div>
	);
}
