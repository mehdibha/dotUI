import { Label } from "@/registry/ui/field";
import { Switch, SwitchIndicator } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<Switch defaultSelected>
			<SwitchIndicator />
			<Label>Airplane Mode</Label>
		</Switch>
	);
}
