'use client'

import * as React from 'react'

import { CodeEditor } from '@/registry/ui/code-editor'

const SAMPLE = `interface User {
  id: string
  name: string
  role: 'admin' | 'member'
}

function greet(user: User): string {
  const prefix = user.role === 'admin' ? 'Welcome back' : 'Hello'
  return \`\${prefix}, \${user.name}!\`
}

const users: User[] = [
  { id: '1', name: 'Ada', role: 'admin' },
  { id: '2', name: 'Linus', role: 'member' },
]

users.map(greet).forEach((line) => console.log(line))
`

export default function Demo() {
  const [value, setValue] = React.useState(SAMPLE)

  return (
    <CodeEditor
      value={value}
      onChange={setValue}
      language="typescript"
      filename="greet.ts"
      className="w-full max-w-xl"
    />
  )
}
