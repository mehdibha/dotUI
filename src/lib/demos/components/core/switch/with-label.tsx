import { Label } from "@/lib/components/core/default/field";
import { Switch } from "@/lib/components/core/default/switch";

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch>Airplane Mode</Switch>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
    </div>
  );
}
