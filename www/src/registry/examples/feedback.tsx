import { CircleAlertIcon } from "lucide-react";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert";
import { Button } from "@/registry/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/registry/ui/empty";
import { toast, Toaster } from "@/registry/ui/toast";

export default function FeedbackGroupExamples() {
	return (
		<Examples>
			<Toaster />
			<Example title="Alert">
				<Alert>
					<CircleAlertIcon />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>You can customize feedback components as a group.</AlertDescription>
				</Alert>
			</Example>
			<Example title="Toast">
				<Button onPress={() => toast.add({ title: "Changes saved", description: "Your update is live." })}>
					Show toast
				</Button>
			</Example>
			<Example title="Empty">
				<Empty>
					<EmptyHeader>
						<EmptyTitle>No results</EmptyTitle>
						<EmptyDescription>Try adjusting your filters.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</Example>
		</Examples>
	);
}
