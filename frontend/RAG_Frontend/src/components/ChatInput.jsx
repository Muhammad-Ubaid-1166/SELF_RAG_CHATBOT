import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'What are the company policies?',
  'Tell me about performance reviews',
  'What disciplinary actions exist?',
]

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t py-4 px-4 md:px-6" style={{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-40"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
            }}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onSend(q)}
              disabled={isLoading}
              className="text-xs rounded-full px-3 py-1.5 border transition-colors disabled:opacity-40"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-surface-alt)',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
