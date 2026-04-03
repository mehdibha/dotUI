import { Label } from "@/registry/ui/field";
import { Switch, SwitchIndicator } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<Switch>
			<SwitchIndicator />
			<Label>Focus mode</Label>
		</Switch>
	);
}
