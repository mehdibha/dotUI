'use client'

import { ColorEditor, type ColorEditorProps } from '@/registry/ui/color-editor'

export default function Demo({
  showAlphaChannel = false,
  showFormatSelector = true,
}: ColorEditorProps = {}) {
  return (
    <ColorEditor
      defaultValue="#5100FF"
      showAlphaChannel={showAlphaChannel}
      showFormatSelector={showFormatSelector}
    />
  )
}
