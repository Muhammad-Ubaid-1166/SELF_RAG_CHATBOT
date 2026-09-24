import { useState } from 'react'

export default function SourceCard({ doc }) {
  const [expanded, setExpanded] = useState(false)

  const isWeb = doc.metadata?.source === 'web'
  const title = doc.metadata?.title || 'Untitled'
  const url = doc.metadata?.url || ''
  const page = doc.metadata?.page
  const totalPages = doc.metadata?.total_pages

  const maxLength = 300
  const shouldTruncate = doc.content.length > maxLength
  const displayContent = expanded || !shouldTruncate
    ? doc.content
    : doc.content.slice(0, maxLength) + '...'

  return (
    <div
      className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: isWeb ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: isWeb ? '#3b82f6' : '#16a34a',
                }}
              >
                {isWeb ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {isWeb ? 'Web' : 'PDF'}
              </span>
            </div>
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {title}
            </p>
            {isWeb && url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs truncate block hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                {url.replace(/^https?:\/\//, '').replace(/\/.*/, '')}
              </a>
            )}
            {!isWeb && page && (
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Page {page}{totalPages ? ` of ${totalPages}` : ''}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
          {displayContent}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium mt-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-primary)' }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}
