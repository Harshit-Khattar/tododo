import { Bold, Palette, Trash2 } from 'lucide-react'
import { useEffect, useState, type KeyboardEvent } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAutoGrow } from '@/hooks/useAutoGrow'
import { NOTE_COLORS, NOTE_COLOR_ORDER } from '@/lib/noteColors'
import { cn } from '@/lib/utils'
import type { Note, NoteColor } from '@/types/database'

interface NoteRowProps {
  note: Note
  onPatch: (patch: Partial<Note>) => void
  onDelete: () => void
  onEnter: () => void
}

export function NoteRow({ note, onPatch, onDelete, onEnter }: NoteRowProps) {
  const [draft, setDraft] = useState(note.content)
  const textarea = useAutoGrow(draft)

  // Accept content arriving from elsewhere (realtime, another tab) unless the
  // row is being typed in.
  useEffect(() => {
    if (document.activeElement !== textarea.current) setDraft(note.content)
  }, [note.content, textarea])

  function commit() {
    if (draft !== note.content) onPatch({ content: draft })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      commit()
      onEnter()
    } else if (event.key === 'Backspace' && draft === '') {
      event.preventDefault()
      onDelete()
    }
  }

  return (
    <div className="group flex items-start gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-background/60">
      <input
        type="checkbox"
        checked={note.done}
        onChange={(event) => onPatch({ done: event.target.checked })}
        className="mt-[3px] size-[15px] shrink-0 cursor-pointer accent-accent"
        aria-label={note.content || 'Untitled item'}
      />

      <textarea
        ref={textarea}
        rows={1}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        placeholder="Empty"
        className={cn(
          'min-w-0 flex-1 resize-none bg-transparent text-[15px] leading-[1.5] outline-none',
          'placeholder:text-muted-foreground/50',
          NOTE_COLORS[note.color].text,
          note.bold && 'font-semibold',
          note.done && 'text-muted-foreground line-through',
        )}
      />

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <RowButton
          label={note.bold ? 'Remove bold' : 'Bold'}
          active={note.bold}
          onClick={() => onPatch({ bold: !note.bold })}
        >
          <Bold className="size-3.5" />
        </RowButton>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Colour"
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Palette className="size-3.5" />
              <span className="sr-only">Colour</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1.5">
            <div className="flex gap-1">
              {NOTE_COLOR_ORDER.map((color) => (
                <Swatch
                  key={color}
                  color={color}
                  selected={note.color === color}
                  onSelect={() => onPatch({ color })}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <RowButton label="Delete" onClick={onDelete} destructive>
          <Trash2 className="size-3.5" />
        </RowButton>
      </div>
    </div>
  )
}

function RowButton({
  label,
  onClick,
  active,
  destructive,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  destructive?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'rounded p-1 transition-colors hover:bg-muted',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        destructive && 'hover:text-urgent-dot',
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}

function Swatch({
  color,
  selected,
  onSelect,
}: {
  color: NoteColor
  selected: boolean
  onSelect: () => void
}) {
  const { label, swatch } = NOTE_COLORS[color]

  return (
    <button
      type="button"
      title={label}
      onClick={onSelect}
      className={cn(
        'size-5 rounded-full ring-offset-2 ring-offset-background transition-shadow',
        swatch,
        selected && 'ring-2 ring-foreground/40',
      )}
    >
      <span className="sr-only">{label}</span>
    </button>
  )
}
