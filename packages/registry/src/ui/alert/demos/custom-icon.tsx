import { InfoIcon } from "@dotui/registry/icons";
import { Alert, AlertDescription, AlertTitle } from "@dotui/registry/ui/alert";

export default function Demo() {
	return (
		<Alert variant="info">
			<InfoIcon />
			<AlertTitle>Information</AlertTitle>
			<AlertDescription>This alert uses a custom icon to convey additional context.</AlertDescription>
		</Alert>
	);
}
