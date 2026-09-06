import ColorEditorDemo from "@/registry/ui/color-editor/demos/default"
import ColorSwatchPickerDemo from "@/registry/ui/color-swatch-picker/demos/basic"
import ColorSwatchDemo from "@/registry/ui/color-swatch/demos/default"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ColorSwatchesGroupExamples() {
  return (
    <Examples>
      <Example title="Color Swatch">
        <ColorSwatchDemo />
      </Example>
      <Example title="Color Swatch Picker">
        <ColorSwatchPickerDemo />
      </Example>
      <Example title="Color Editor">
        <ColorEditorDemo />
      </Example>
    </Examples>
  )
}
