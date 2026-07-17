'use client'

import { FileIcon, TerminalIcon } from 'lucide-react'

import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TokenInput, TokenSegmentList } from '@/registry/ui/token-field'

interface Suggestion {
  id: string
  description?: string
}

const files: Suggestion[] = [
  { id: 'README.md' },
  { id: 'package.json' },
  { id: 'src/app.tsx' },
  { id: 'src/routes.tsx' },
  { id: 'src/styles.css' },
]

const commands: Suggestion[] = [
  { id: 'goal', description: 'Set a goal for the session' },
  { id: 'review', description: 'Review the current diff' },
  { id: 'test', description: 'Run the test suite' },
  { id: 'commit', description: 'Commit staged changes' },
]

// A regex trigger matches several characters; the render-function children
// receive the active trigger, so the suggestions depend on which one was typed.
export default function Demo() {
  return (
    <Mention
      allowsNewlines
      trigger={/[@/]/}
      defaultValue={
        new TokenSegmentList([
          { type: 'token', text: '/review' },
          { type: 'text', text: ' the changes in ' },
          { type: 'token', text: '@src/app.tsx' },
          { type: 'text', text: ' ' },
        ])
      }
      className="w-[360px]"
    >
      {({ trigger }) => (
        <>
          <TokenInput
            aria-label="Prompt"
            placeholder="Type @ for files or / for commands..."
          />
          <Popover>
            <MenuContent
              items={trigger === '/' ? commands : files}
              renderEmptyState={() => 'No results found.'}
            >
              {(item) => (
                <MenuItem id={item.id} textValue={item.id}>
                  {trigger === '/' ? <TerminalIcon /> : <FileIcon />}
                  {item.description ? (
                    <div className="flex flex-col">
                      <span className="text-sm">/{item.id}</span>
                      <span className="text-xs text-fg-muted">
                        {item.description}
                      </span>
                    </div>
                  ) : (
                    item.id
                  )}
                </MenuItem>
              )}
            </MenuContent>
          </Popover>
        </>
      )}
    </Mention>
  )
}
