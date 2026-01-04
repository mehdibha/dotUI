import { Label } from "@dotui/registry/ui/field";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

export default function Demo() {
	return (
		<Switch
		// variant="card"
		>
			<SwitchIndicator />
			<Label>Focus mode</Label>
		</Switch>
	);
}
