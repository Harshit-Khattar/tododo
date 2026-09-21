import { Plus } from 'lucide-react'

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

  const addNote = () => createNote.mutate({ content: '', position: positionAt(notes, notes.length) })
  const remaining = notes.filter((note) => !note.done).length

  return (
    <section className="flex w-[21rem] shrink-0 flex-col gap-1 rounded-[10px] border border-border/60 bg-notes-surface p-2">
      <header className="flex items-center gap-2 px-1 pb-0.5 pt-1">
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-planned-chip px-1.5 py-[3px] text-[12px] font-medium leading-none">
          <span className="size-[5px] rounded-full bg-planned-dot" />
          Notes
        </span>
        <span data-numeric className="text-[12.5px] font-medium text-planned-dot">
          {remaining}
        </span>
      </header>

      <div className="flex min-h-10 flex-col">
        {notes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            onPatch={(patch) => updateNote.mutate({ id: note.id, ...patch })}
            onDelete={() => deleteNote.mutate(note.id)}
            onEnter={addNote}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <p className="px-3 py-2 text-[13.5px] text-muted-foreground/75">
          A blank page. Jot anything down.
        </p>
      )}

      <button
        type="button"
        onClick={addNote}
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[13.5px] font-medium text-planned-dot opacity-65 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <Plus className="size-3.5" />
        New item
      </button>
    </section>
  )
}
