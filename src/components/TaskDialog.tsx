import { format } from 'date-fns'
import { CalendarDays, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { TagInput } from '@/components/TagInput'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTask, useDeleteTask, useUpdateTask } from '@/hooks/useTasks'
import { STATUSES, STATUS_ORDER } from '@/lib/statuses'
import type { Task, TaskStatus } from '@/types/database'

interface TaskDraft {
  title: string
  notes: string
  status: TaskStatus
  tags: string[]
  due_date: string | null
}

const emptyDraft = (status: TaskStatus): TaskDraft => ({
  title: '',
  notes: '',
  status,
  tags: [],
  due_date: null,
})

interface TaskDialogProps {
  /** Task being edited, or null when composing a new one. */
  task: Task | null
  status: TaskStatus
  open: boolean
  onOpenChange: (open: boolean) => void
  nextPosition: (status: TaskStatus) => number
}

export function TaskDialog({ task, status, open, onOpenChange, nextPosition }: TaskDialogProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => emptyDraft(status))
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  useEffect(() => {
    if (!open) return
    setDraft(
      task
        ? {
            title: task.title,
            notes: task.notes ?? '',
            status: task.status,
            tags: task.tags,
            due_date: task.due_date,
          }
        : emptyDraft(status),
    )
  }, [open, task, status])

  const patch = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  function handleSubmit() {
    const title = draft.title.trim()
    if (!title) return

    const fields = { ...draft, title, notes: draft.notes.trim() || null }

    if (task) {
      const position =
        task.status === draft.status ? task.position : nextPosition(draft.status)
      updateTask.mutate({ id: task.id, ...fields, position })
    } else {
      createTask.mutate({ ...fields, position: nextPosition(draft.status) })
    }

    onOpenChange(false)
  }

  function handleDelete() {
    if (task) deleteTask.mutate(task.id)
    onOpenChange(false)
  }

  const dueDate = draft.due_date ? new Date(`${draft.due_date}T00:00:00`) : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">{task ? 'Edit task' : 'New task'}</DialogTitle>

        <div className="space-y-4">
          <Input
            autoFocus
            value={draft.title}
            onChange={(event) => patch('title', event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            placeholder="Task name"
            className="h-auto rounded-none border-x-0 border-t-0 px-0 pb-2 font-serif text-[22px] font-semibold"
          />

          <div className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
            <span className="text-muted-foreground">Status</span>
            <Select
              value={draft.status}
              onValueChange={(value) => patch('status', value as TaskStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ORDER.map((option) => (
                  <SelectItem key={option} value={option}>
                    {STATUSES[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">Due</span>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 flex-1 justify-start font-normal">
                    <CalendarDays className="text-muted-foreground" />
                    {dueDate ? format(dueDate, 'MMMM d, yyyy') : 'Empty'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    defaultMonth={dueDate}
                    onSelect={(date) =>
                      patch('due_date', date ? format(date, 'yyyy-MM-dd') : null)
                    }
                  />
                </PopoverContent>
              </Popover>
              {draft.due_date && (
                <Button variant="ghost" size="sm" onClick={() => patch('due_date', null)}>
                  Clear
                </Button>
              )}
            </div>

            <span className="self-start pt-2 text-muted-foreground">Tags</span>
            <TagInput value={draft.tags} onChange={(tags) => patch('tags', tags)} />
          </div>

          <Textarea
            value={draft.notes}
            onChange={(event) => patch('notes', event.target.value)}
            placeholder="Notes"
          />

          <div className="flex items-center justify-between pt-1">
            {task ? (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!draft.title.trim()}>
                {task ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
