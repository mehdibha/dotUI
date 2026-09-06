import ColorPickerDemo from "@/registry/ui/color-picker/demos/basic"
import ComboboxDemo from "@/registry/ui/combobox/demos/basic"
import DatePickerDemo from "@/registry/ui/date-picker/demos/basic"
import MentionDemo from "@/registry/ui/mention/demos/basic"
import SelectDemo from "@/registry/ui/select/demos/basic"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function PickersGroupExamples() {
  return (
    <Examples>
      <Example title="Select">
        <SelectDemo />
      </Example>
      <Example title="Combobox">
        <ComboboxDemo />
      </Example>
      <Example title="Mention">
        <MentionDemo />
      </Example>
      <Example title="Date Picker">
        <DatePickerDemo />
      </Example>
      <Example title="Color Picker">
        <ColorPickerDemo />
      </Example>
    </Examples>
  )
}
