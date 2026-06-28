import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'

export default function Demo() {
  return (
    <RadioGroup defaultValue="weekly" className="w-full max-w-xs">
      <Label>Email updates</Label>
      <Description>Choose how often we email you.</Description>
      <FieldGroup>
        <Radio value="realtime">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Real-time</Label>
              <Description>Notify me as activity happens</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="daily">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Daily digest</Label>
              <Description>One summary every morning</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="weekly">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Weekly digest</Label>
              <Description>A recap every Monday</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
        <Radio value="off">
          <RadioControl>
            <RadioIndicator />
            <FieldContent>
              <Label>Off</Label>
              <Description>Don't send me any emails</Description>
            </FieldContent>
          </RadioControl>
        </Radio>
      </FieldGroup>
    </RadioGroup>
  )
}
