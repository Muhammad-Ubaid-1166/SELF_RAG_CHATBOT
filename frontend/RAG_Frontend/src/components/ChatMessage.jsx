import { useState } from 'react'
import Markdown from 'react-markdown'

export default function ChatMessage({ message, onViewSources }) {
  const [showContext, setShowContext] = useState(false)
  const [copied, setCopied] = useState(false)

  const isUser = message.role === 'user'
  const isError = message.isError
  const noDocFound = message.content === 'No relevant document found.'
  const hasDocs = message.relevantDocs?.length > 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div
            className="rounded-2xl rounded-br-md px-4 py-3 shadow-sm"
            style={{
              backgroundColor: 'var(--color-user-bg)',
              color: 'var(--color-user-text)',
            }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-[11px] mt-1 text-right" style={{ color: 'var(--color-text-secondary)' }}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] md:max-w-[70%]">
        <div
          className="rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border"
          style={{
            backgroundColor: 'var(--color-assistant-bg)',
            borderColor: 'var(--color-border)',
          }}
        >
          {isError ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>{message.content}</p>
            </div>
          ) : noDocFound ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{message.content}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  No matching documents were found for your query.
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-text)' }}>
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {message.context && !noDocFound && !isError && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setShowContext(!showContext)}
                className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${showContext ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showContext ? 'Hide' : 'View'} context
              </button>
              {showContext && (
                <p className="text-xs mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                  {message.context}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            {formatTime(message.timestamp)}
          </p>
          {hasDocs && (
            <button
              onClick={() => onViewSources?.(message.id)}
              className="text-[11px] font-medium flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {message.relevantDocs.length} source{message.relevantDocs.length > 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="ml-auto text-[11px] transition-opacity hover:opacity-70"
            style={{ color: copied ? 'var(--color-success)' : 'var(--color-text-secondary)' }}
            title="Copy answer"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
