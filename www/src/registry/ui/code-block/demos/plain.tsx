import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/registry/ui/code-block'

const code = `{
  "name": "dotui",
  "private": true,
  "scripts": {
    "dev": "vite"
  }
}`

export default function Demo() {
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>package.json</CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent code={code} />
    </CodeBlock>
  )
}
