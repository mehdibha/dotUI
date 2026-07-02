'use client'

import * as React from 'react'

import {
  AIAssistant,
  AIAssistantInput,
  AIAssistantMessage,
  AIAssistantMessages,
} from '@/registry/ui/ai-assistant'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hi! I am your design assistant. Ask me anything about your theme.',
  },
  {
    id: 2,
    role: 'user',
    content: 'How do I change the primary color?',
  },
  {
    id: 3,
    role: 'assistant',
    content:
      'Open the color panel and pick a new accent — every component updates live.',
  },
]

export default function Demo() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [value, setValue] = React.useState('')
  const nextId = React.useRef(initialMessages.length + 1)

  const handleSend = (text: string) => {
    const userId = nextId.current++
    const assistantId = nextId.current++
    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', content: text },
      {
        id: assistantId,
        role: 'assistant',
        content: `Got it — "${text}". Let me look into that for you.`,
      },
    ])
    setValue('')
  }

  return (
    <AIAssistant className="h-96 w-full max-w-md">
      <AIAssistantMessages>
        {messages.map((message) => (
          <AIAssistantMessage key={message.id} role={message.role}>
            {message.content}
          </AIAssistantMessage>
        ))}
      </AIAssistantMessages>
      <AIAssistantInput
        value={value}
        onValueChange={setValue}
        onSend={handleSend}
        placeholder="Ask the assistant..."
      />
    </AIAssistant>
  )
}
