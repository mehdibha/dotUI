import { Switch } from "@/lib/components/core/default/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultChecked/>
      <Switch size="md" defaultChecked/>
      <Switch size="lg" defaultChecked/>
    </div>
  );
}
