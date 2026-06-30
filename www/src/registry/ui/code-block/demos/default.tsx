import { CodeBlock } from '@/registry/ui/code-block'

const code = `import { Button } from '@/components/ui/button'

export function App() {
  return <Button>Click me</Button>
}`

export default function Demo() {
  return (
    <CodeBlock
      title="app.tsx"
      lang="tsx"
      code={code}
      showLineNumbers
      className="w-full max-w-lg"
    />
  )
}
