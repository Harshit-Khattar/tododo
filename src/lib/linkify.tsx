import type { ReactNode } from 'react'

/**
 * Matches http(s):// and bare www. runs. Trailing punctuation is excluded so a
 * URL at the end of a sentence does not swallow the full stop or bracket.
 * Because only these two prefixes match, a `javascript:` payload can never
 * reach an href.
 */
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s]+[^\s.,:;!?"')\]}])/gi

export function linkify(text: string): ReactNode {
  const parts = text.split(URL_PATTERN)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={part.startsWith('www.') ? `https://${part}` : part}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="text-link underline decoration-link/40 underline-offset-2 hover:decoration-link"
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}
