import { ColorEditor } from "@/registry/ui/color-editor"

export function ColorEditorDemo() {
  return (
    <ColorEditor
      defaultValue="#7f007f"
      showFormatSelector={false}
      className="w-56"
    />
  )
}
