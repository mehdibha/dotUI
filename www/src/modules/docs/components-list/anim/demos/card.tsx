"use client";

import { Button } from "@/registry/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";

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
				<Card size="sm" className="w-60">
					<CardHeader>
						<CardTitle>Upgrade to Pro</CardTitle>
						<CardDescription>Unlock advanced analytics and priority support.</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button variant="primary" size="sm" className="w-full">
							Upgrade
						</Button>
					</CardFooter>
				</Card>
			)}
		</AnimatedPreview>
	);
}
