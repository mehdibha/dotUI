"use client";

import { useState } from "react";

import { FlipHorizontalIcon, FlipVerticalIcon, RotateCwIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	// index of the momentarily-pressed button (visual feedback only)
	const [pressed, setPressed] = useState<number | null>(null);
	const tap = (i: number) => {
		setPressed(i);
		setTimeout(() => setPressed(null), 150);
	};
	const scale = (i: number) => ({ scale: pressed === i ? 0.9 : 1 }) as const;
	return (
		<AnimatedPreview
			reset={() => setPressed(null)}
			script={async (s) => {
				await s.wait(500);
				await s.click({ selector: "[data-button]:nth-child(1)" }, () => tap(0));
				await s.wait(800);
				await s.click({ selector: "[data-button]:nth-child(3)" }, () => tap(2));
				await s.wait(800);
				await s.click({ selector: "[data-button]:nth-child(2)" }, () => tap(1));
				await s.wait(900);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{() => (
				<Group aria-label="Transform image">
					<Button isIconOnly aria-label="Flip horizontal" className="transition-transform" style={scale(0)}>
						<FlipHorizontalIcon />
					</Button>
					<Button isIconOnly aria-label="Flip vertical" className="transition-transform" style={scale(1)}>
						<FlipVerticalIcon />
					</Button>
					<Button isIconOnly aria-label="Rotate" className="transition-transform" style={scale(2)}>
						<RotateCwIcon />
					</Button>
				</Group>
			)}
		</AnimatedPreview>
	);
}
