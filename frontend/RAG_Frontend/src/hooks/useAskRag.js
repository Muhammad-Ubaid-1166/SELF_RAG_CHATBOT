import { useState, useCallback, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export function useAskRag() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSources, setShowSources] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rag-theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rag-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  const ask = useCallback(async (question) => {
    if (!question.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.detail || `Server error: ${res.status}`)
      }

      const data = await res.json()

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        context: data.context || '',
        relevantDocs: data.relevant_docs || [],
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        isError: true,
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    setSelectedMessageId(null)
    setShowSources(false)
  }, [])

  const viewSources = useCallback((messageId) => {
    setSelectedMessageId(messageId)
    setShowSources(true)
  }, [])

  const closeSources = useCallback(() => {
    setShowSources(false)
    setSelectedMessageId(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    theme,
    toggleTheme,
    showSources,
    selectedMessageId,
    ask,
    clearChat,
    viewSources,
    closeSources,
    setShowSources,
  }
}
