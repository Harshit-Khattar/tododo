import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isBefore, startOfToday } from 'date-fns'

import { StatusChip } from '@/components/StatusChip'
import { TagChip } from '@/components/TagChip'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/database'

export function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClick={() => onOpen(task)}
      className={cn(isDragging && 'opacity-40')}
      {...attributes}
      {...listeners}
    >
      <TaskCardBody task={task} />
    </div>
  )
}

/** Presentational card — also used inside the drag overlay. */
export function TaskCardBody({ task }: { task: Task }) {
  return (
    <article className="cursor-pointer space-y-2 rounded-lg border border-border bg-background p-3 shadow-[0_1px_2px_rgba(15,15,15,0.06)] transition-shadow hover:shadow-[0_2px_6px_rgba(15,15,15,0.12)]">
      <h3 className="text-sm font-medium leading-snug">{task.title}</h3>

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusChip status={task.status} />
        {task.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>

      {task.due_date && <DueDate value={task.due_date} done={task.status === 'completed'} />}
    </article>
  )
}

function DueDate({ value, done }: { value: string; done: boolean }) {
  const date = new Date(`${value}T00:00:00`)
  const overdue = !done && isBefore(date, startOfToday())

  return (
    <p className={cn('text-xs', overdue ? 'text-urgent-dot' : 'text-muted-foreground')}>
      {format(date, 'MMMM d, yyyy')}
    </p>
  )
}
