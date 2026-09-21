import { useRef } from 'react'

import { NoteComposer } from '@/components/NoteComposer'
import { NoteRow } from '@/components/NoteRow'
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from '@/hooks/useNotes'
import { positionAt } from '@/lib/position'

/**
 * Scratch lane. Registers no droppable and no sortable, so dnd-kit never sees
 * it: cards cannot be dropped here and notes never leave. A plain list.
 */
export function Notepad() {
  const { data: notes = [] } = useNotes()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()
  const composer = useRef<HTMLTextAreaElement>(null)

  const remaining = notes.filter((note) => !note.done).length

  return (
    <section className="flex w-[21rem] shrink-0 flex-col gap-1 rounded-[10px] border border-border/60 bg-notes-surface p-2 pb-3">
      <header className="flex items-center gap-2 px-1 pb-0.5 pt-1">
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-planned-chip px-1.5 py-[3px] text-[12px] font-medium leading-none">
          <span className="size-[5px] rounded-full bg-planned-dot" />
          Notes
        </span>
        <span data-numeric className="text-[12.5px] font-medium text-planned-dot">
          {remaining}
        </span>
      </header>

      <div className="flex flex-col">
        {notes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            onPatch={(patch) => updateNote.mutate({ id: note.id, ...patch })}
            onDelete={() => deleteNote.mutate(note.id)}
            onEnter={() => composer.current?.focus()}
          />
        ))}

        <NoteComposer
          textareaRef={composer}
          onCreate={(content) =>
            createNote.mutate({ content, position: positionAt(notes, notes.length) })
          }
        />
      </div>
    </section>
  )
}
