import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useHighlightedCode,
} from '@/registry/ui/code-block'

const code = `export function Hello() {
  return <p>Hello, world</p>
}`

export function CodeBlockDemo() {
  const html = useHighlightedCode(code)
  return (
    <CodeBlock className="w-64">
      <CodeBlockHeader>
        <CodeBlockTitle>hello.tsx</CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent code={code} html={html ?? undefined} />
    </CodeBlock>
  )
}
