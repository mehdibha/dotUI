import { CircleAlertIcon } from "lucide-react";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert";
import { Button } from "@/registry/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/registry/ui/empty";
import { ToastProvider, toastManager } from "@/registry/ui/toast";

export default function FeedbackGroupExamples() {
	return (
		<Examples>
			<ToastProvider />
			<Example title="Alert">
				<Alert>
					<CircleAlertIcon />
					<AlertTitle>Heads up!</AlertTitle>
					<AlertDescription>You can customize feedback components as a group.</AlertDescription>
				</Alert>
			</Example>
			<Example title="Toast">
				<Button
					onPress={() =>
						toastManager.add({
							title: "Changes saved",
							description: "Your update is live.",
							type: "success",
						})
					}
				>
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
