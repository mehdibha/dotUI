import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@dotui/registry/ui/avatar";

export default function Demo() {
	return (
		<AvatarGroup>
			<Avatar>
				<AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
				<AvatarFallback>M</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/tannerlinsley.png" alt="@tannerlinsley" />
				<AvatarFallback>T</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/devongovett.png" alt="@devongovett" />
				<AvatarFallback>D</AvatarFallback>
			</Avatar>
			<AvatarGroupCount>+3</AvatarGroupCount>
		</AvatarGroup>
	);
}
