import { useRef, useEffect } from 'react'
import { useAskRag } from './hooks/useAskRag'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import SourceCard from './components/SourceCard'

function App() {
  const {
    messages,
    isLoading,
    theme,
    toggleTheme,
    showSources,
    selectedMessageId,
    ask,
    clearChat,
    viewSources,
    closeSources,
  } = useAskRag()

  const chatEndRef = useRef(null)
  const selectedMessage = messages.find((m) => m.id === selectedMessageId)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-svh" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="shrink-0 border-b px-4 md:px-6 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              RAG Assistant
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sources toggle (when messages have docs) */}
          {messages.some((m) => m.relevantDocs?.length > 0) && (
            <button
              onClick={() => closeSources()}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors md:hidden"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Sources
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 border transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-lg p-2 border transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Chat Area ─────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <svg className="w-8 h-8" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                    How can I help you?
                  </h2>
                  <p className="text-sm max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
                    Ask questions about your documents. I'll search through your knowledge base and provide answers with relevant sources.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} onViewSources={viewSources} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div
                        className="rounded-2xl rounded-bl-md px-4 py-3 border"
                        style={{
                          backgroundColor: 'var(--color-assistant-bg)',
                          borderColor: 'var(--color-border)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-primary)', animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
          </div>

          <ChatInput onSend={ask} isLoading={isLoading} />
        </div>

        {/* ── Sources Panel (Desktop) ──────────────── */}
        {showSources && selectedMessage && selectedMessage.relevantDocs?.length > 0 && (
          <aside
            className="hidden md:flex flex-col w-80 shrink-0 border-l overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="shrink-0 px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Sources ({selectedMessage.relevantDocs.length})
              </h2>
              <button
                onClick={closeSources}
                className="p-1 rounded-md transition-colors hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedMessage.relevantDocs.map((doc, i) => (
                <SourceCard key={i} doc={doc} />
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* ── Sources Drawer (Mobile) ────────────────── */}
      {showSources && selectedMessage && selectedMessage.relevantDocs?.length > 0 && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={closeSources}
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] rounded-t-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="shrink-0 px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Sources ({selectedMessage.relevantDocs.length})
              </h2>
              <button
                onClick={closeSources}
                className="p-1 rounded-md"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedMessage.relevantDocs.map((doc, i) => (
                <SourceCard key={i} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
