import { useState, type KeyboardEvent, type RefObject } from 'react'

import { useAutoGrow } from '@/hooks/useAutoGrow'

interface NoteComposerProps {
  onCreate: (content: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

/**
 * The permanent blank line at the foot of the list. It is local state, not a
 * row, so an untouched lane never writes empty notes to the database.
 */
export function NoteComposer({ onCreate, textareaRef }: NoteComposerProps) {
  const [draft, setDraft] = useState('')
  const ref = useAutoGrow(draft, textareaRef)

  function commit() {
    const content = draft.trim()
    if (!content) return
    onCreate(content)
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      commit()
    }
  }

  return (
    <div className="flex items-start gap-2 rounded-md px-1.5 py-1">
      <input
        type="checkbox"
        disabled
        checked={false}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="mt-[3px] size-[15px] shrink-0 opacity-30"
      />
      <textarea
        ref={ref}
        rows={1}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder="Add an item"
        aria-label="Add an item"
        className="min-w-0 flex-1 resize-none bg-transparent text-[15px] leading-[1.5] outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  )
}
