'use client'

import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
    initialInput: 'Please help create a student',
    api: '/dashboard/students/add/chat/api',
  })
  return (
    <div className="py-4">
      <p className="text-lg font-semibold">Chat</p>
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 divide-y divide-gray-200"
      >
        <input
          className="fixed bottom-12 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
