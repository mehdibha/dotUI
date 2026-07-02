'use client'

import {
  RichTextEditor,
  RichTextEditorContent,
  RichTextEditorToolbar,
} from '@/registry/ui/rich-text-editor'

const content = `
<h2>Release notes</h2>
<p>We shipped a <strong>rich-text editor</strong> this week. A few highlights:</p>
<ul>
  <li>Inline marks — <em>italic</em>, <s>strikethrough</s>, and <code>code</code>.</li>
  <li>Block formats like headings, lists, and quotes.</li>
</ul>
<blockquote>Built on Tiptap, styled with dotUI tokens.</blockquote>
<p>Select some text or place your cursor, then use the toolbar above.</p>
`

export default function Demo() {
  return (
    <RichTextEditor className="max-w-xl" content={content}>
      <RichTextEditorToolbar />
      <RichTextEditorContent />
    </RichTextEditor>
  )
}
