'use client'

import { useChat } from 'ai/react'
import { CreateStudent } from './CreateStudent'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxSteps: 5,
      api: '/dashboard/students/chat/api',
    })

  return (
    <div className="mb-40 py-4">
      <p className="text-lg font-semibold">Chat</p>
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          {m.toolInvocations?.map((toolInvocation) => {
            const { toolCallId, toolName, args } = toolInvocation
            const addResult = (studentId: string) =>
              addToolResult({ toolCallId, result: { studentId } })

            if (toolName === 'createStudent') {
              return (
                <CreateStudent
                  key={toolCallId}
                  message={args.message}
                  setStudentId={addResult}
                />
              )
            }
            return null
          })}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 divide-y divide-gray-200"
      >
        <input
          className="fixed bottom-12 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
          value={input || ''}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
