'use client'

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useHighlightedCode,
} from '@/registry/ui/code-block'

const code = `function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}`

export default function Demo() {
  const html = useHighlightedCode(code, 'js')
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>debounce.js</CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent code={code} html={html ?? undefined} showLineNumbers />
    </CodeBlock>
  )
}
