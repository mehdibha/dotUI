import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";

export function AlertDemo() {
	return (
		<div className="p-6">
			<Alert>
				<AlertTitle>Payment information</AlertTitle>
				<AlertDescription>You are currently on the free plan. Upgrade to unlock more features.</AlertDescription>
			</Alert>
		</div>
	);
}
