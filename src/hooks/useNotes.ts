import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { Note, NoteInsert, NoteUpdate } from '@/types/database'

const NOTES_KEY = ['notes'] as const

export function useNotes() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        void queryClient.invalidateQueries({ queryKey: NOTES_KEY })
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: NOTES_KEY,
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (note: NoteInsert) => {
      const { error } = await supabase.from('notes').insert(note)
      if (error) throw error
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}

/**
 * Optimistic — typing, ticking, and recolouring all land here, and none of them
 * should wait on a round trip.
 */
export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...patch }: NoteUpdate & { id: string }) => {
      const { error } = await supabase.from('notes').update(patch).eq('id', id)
      if (error) throw error
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: NOTES_KEY })
      const previous = queryClient.getQueryData<Note[]>(NOTES_KEY)

      queryClient.setQueryData<Note[]>(NOTES_KEY, (notes) =>
        notes?.map((note) => (note.id === variables.id ? { ...note, ...variables } : note)),
      )

      return { previous }
    },
    onError: (error: Error, _variables, context) => {
      queryClient.setQueryData(NOTES_KEY, context?.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTES_KEY })
      const previous = queryClient.getQueryData<Note[]>(NOTES_KEY)
      queryClient.setQueryData<Note[]>(NOTES_KEY, (notes) =>
        notes?.filter((note) => note.id !== id),
      )
      return { previous }
    },
    onError: (error: Error, _id, context) => {
      queryClient.setQueryData(NOTES_KEY, context?.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}
