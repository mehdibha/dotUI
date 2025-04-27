import { Switch } from "@/components/dynamic-ui/switch";

export default function Demo() {
  return (
    <div className="flex items-center gap-10">
      <Switch isDisabled defaultSelected>
        Focus Mode
      </Switch>
      <Switch isDisabled>Focus Mode</Switch>
    </div>
  );
}
