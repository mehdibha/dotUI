import { CaptionsIcon } from "@/registry/__generated__/icons";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/registry/ui/card";

export default function Demo() {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Meeting Notes</CardTitle>
				<CardDescription>Transcript from the meeting with the client.</CardDescription>
				<CardAction>
					<Button variant="default" size="sm">
						<CaptionsIcon />
						Transcribe
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
				<ol className="mt-4 flex list-decimal flex-col gap-2 pl-6">
					<li>New analytics widgets for daily/weekly metrics</li>
					<li>Simplified navigation menu</li>
					<li>Dark mode support</li>
					<li>Timeline: 6 weeks</li>
					<li>Follow-up meeting scheduled for next Tuesday</li>
				</ol>
			</CardContent>
			<CardFooter>
				<AvatarGroup>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
						<AvatarFallback>LR</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
						<AvatarFallback>ER</AvatarFallback>
					</Avatar>
					<AvatarGroupCount>+8</AvatarGroupCount>
				</AvatarGroup>
			</CardFooter>
		</Card>
	);
}
