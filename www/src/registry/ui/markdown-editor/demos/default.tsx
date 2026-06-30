'use client'

import * as React from 'react'

import {
  MarkdownEditor,
  MarkdownEditorPreview,
  MarkdownEditorToolbar,
  MarkdownEditorWrite,
} from '@/registry/ui/markdown-editor'

const STARTER = `# Release notes

Write your changelog in **markdown** and switch to _Preview_ to see it rendered.

- Toolbar wraps the current selection
- Supports [links](https://dotui.org) and \`inline code\`

\`\`\`ts
export const version = '1.0.0'
\`\`\`

| Feature | Status |
| ------- | ------ |
| Editor  | Ready  |
| Preview | Ready  |
`

export default function Demo() {
  const [value, setValue] = React.useState(STARTER)

  return (
    <div className="w-full max-w-xl">
      <MarkdownEditor value={value} onChange={setValue}>
        <MarkdownEditorToolbar />
        <MarkdownEditorWrite placeholder="Write something…" />
        <MarkdownEditorPreview />
      </MarkdownEditor>
    </div>
  )
}
