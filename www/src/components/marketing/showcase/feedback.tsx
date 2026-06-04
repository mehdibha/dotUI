"use client";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

const sentiments = [
	{ id: "sad", emoji: "😞", label: "Disappointed" },
	{ id: "neutral", emoji: "😐", label: "Neutral" },
	{ id: "happy", emoji: "🙂", label: "Satisfied" },
	{ id: "love", emoji: "😍", label: "Delighted" },
];

export function Feedback({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Send feedback</CardTitle>
				<CardDescription>How was your experience?</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<ToggleButtonGroup
					aria-label="How was your experience?"
					defaultSelectedKeys={["happy"]}
					className="grid grid-cols-4 gap-2"
				>
					{sentiments.map((sentiment) => (
						<ToggleButton
							key={sentiment.id}
							id={sentiment.id}
							aria-label={sentiment.label}
							className="w-full justify-center text-lg"
						>
							{sentiment.emoji}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
				<TextField className="w-full" defaultValue="Loving the new dashboard, search feels much faster now.">
					<Label>Tell us more</Label>
					<TextArea placeholder="What did you like, or how can we improve?" rows={3} />
				</TextField>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="quiet">Cancel</Button>
				<Button variant="primary">Send</Button>
			</CardFooter>
		</Card>
	);
}
