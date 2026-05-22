import { Label } from "@/registry/ui/field";
import { Switch, SwitchControl } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<Switch defaultSelected isReadOnly>
			<SwitchControl />
			<Label>Focus mode</Label>
		</Switch>
	);
}
