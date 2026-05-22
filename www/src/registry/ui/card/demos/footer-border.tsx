import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";

export default function Demo() {
	return (
		<Card className="w-full max-w-sm">
			<CardContent>
				<p>
					The footer has a border-t class applied, creating a visual separation between the content and footer sections.
				</p>
			</CardContent>
			<CardFooter className="border-t">
				<Button variant="default" className="w-full">
					Footer with Border
				</Button>
			</CardFooter>
		</Card>
	);
}
