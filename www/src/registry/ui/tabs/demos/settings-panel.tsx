import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Description, FieldContent, Label } from '@/registry/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Switch, SwitchControl, SwitchIndicator } from '@/registry/ui/switch'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

export default function Demo() {
  return (
    <Tabs className="w-full max-w-sm">
      <TabList>
        <Tab id="general">General</Tab>
        <Tab id="notifications">Notifications</Tab>
        <Tab id="personalization">Personalization</Tab>
      </TabList>
      <TabPanel id="general">
        <div className="flex flex-col gap-4">
          <Select defaultSelectedKey="utc" placeholder="Select a timezone">
            <Label>Timezone</Label>
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="utc">UTC</SelectItem>
              <SelectItem id="cet">Central European Time</SelectItem>
              <SelectItem id="pst">Pacific Standard Time</SelectItem>
            </SelectContent>
          </Select>
          <Switch className="w-full" defaultSelected>
            <SwitchControl>
              <FieldContent>
                <Label>Auto-save</Label>
                <Description>Save changes as you type.</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        </div>
      </TabPanel>
      <TabPanel id="notifications">
        <div className="flex flex-col gap-4">
          <Switch className="w-full" defaultSelected>
            <SwitchControl>
              <FieldContent>
                <Label>Email digests</Label>
                <Description>A weekly summary of activity.</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
          <Switch className="w-full">
            <SwitchControl>
              <FieldContent>
                <Label>Push notifications</Label>
                <Description>Real-time alerts on your devices.</Description>
              </FieldContent>
              <SwitchIndicator />
            </SwitchControl>
          </Switch>
        </div>
      </TabPanel>
      <TabPanel id="personalization">
        <div className="flex flex-col gap-4">
          <Select defaultSelectedKey="system" placeholder="Select a theme">
            <Label>Theme</Label>
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="system">System</SelectItem>
              <SelectItem id="light">Light</SelectItem>
              <SelectItem id="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
          <Checkbox defaultSelected>
            <CheckboxControl />
            <Label>Reduce motion</Label>
          </Checkbox>
        </div>
      </TabPanel>
    </Tabs>
  )
}
