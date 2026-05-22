import { PlusIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";

export default function Demo() {
	return (
		<Card size="sm">
			<img
				src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop"
				alt="Event cover"
				className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
			/>
			<CardHeader>
				<CardTitle>Beautiful Landscape</CardTitle>
				<CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button size="sm" className="w-full">
					<PlusIcon />
					Button
				</Button>
			</CardFooter>
		</Card>
	);
}
