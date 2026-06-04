"use client";

import { Kbd, KbdGroup } from "@/registry/ui/kbd";

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
				<KbdGroup>
					<Kbd>⌘</Kbd>
					<Kbd>Shift</Kbd>
					<Kbd>P</Kbd>
				</KbdGroup>
			)}
		</AnimatedPreview>
	);
}
