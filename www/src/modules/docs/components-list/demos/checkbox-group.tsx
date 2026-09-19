import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { Description, FieldGroup, Label } from "@/registry/ui/field"

const channels = [
  { id: "email", label: "Email", description: "Weekly digest" },
  {
    id: "push",
    label: "Push",
    description: "Mentions and replies",
  },
  { id: "sms", label: "SMS", description: "Security alerts" },
]

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={["email", "push"]} className="w-fit">
      <Label>Notifications</Label>
      <FieldGroup>
        {channels.map((channel) => (
          <Checkbox key={channel.id} value={channel.id} className="items-start">
            <CheckboxControl />
            <div className="flex flex-col gap-0.5">
              <Label>{channel.label}</Label>
              <Description className="whitespace-nowrap">
                {channel.description}
              </Description>
            </div>
          </Checkbox>
        ))}
      </FieldGroup>
    </CheckboxGroup>
  )
}
