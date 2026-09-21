import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase'
import type { Task, TaskInsert, TaskUpdate } from '@/types/database'

const TASKS_KEY = ['tasks'] as const

const byPosition = (a: Task, b: Task) => a.position - b.position

export function useTasks() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        void queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [queryClient])

  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { error } = await supabase.from('tasks').insert(task)
      if (error) throw error
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

/**
 * Patches a task optimistically — drag-and-drop goes through here, so the board
 * must settle before the round trip. Rolls back on failure.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...patch }: TaskUpdate & { id: string }) => {
      const { error } = await supabase.from('tasks').update(patch).eq('id', id)
      if (error) throw error
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY)

      queryClient.setQueryData<Task[]>(TASKS_KEY, (tasks) =>
        tasks
          ?.map((task) => (task.id === variables.id ? { ...task, ...variables } : task))
          .sort(byPosition),
      )

      return { previous }
    },
    onError: (error: Error, _variables, context) => {
      queryClient.setQueryData(TASKS_KEY, context?.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}
