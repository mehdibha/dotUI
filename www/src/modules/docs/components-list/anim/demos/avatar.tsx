"use client";

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/registry/ui/avatar";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.moveOff();
				await s.wait(2400);
			}}
		>
			{() => (
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
			)}
		</AnimatedPreview>
	);
}
