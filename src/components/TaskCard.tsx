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
    <article
      className={cn(
        'cursor-pointer rounded-md border border-border/70 bg-background p-3',
        'shadow-[0_1px_1px_rgba(36,40,44,0.04),0_2px_4px_-2px_rgba(36,40,44,0.08)]',
        'transition-shadow duration-150',
        'hover:shadow-[0_1px_1px_rgba(36,40,44,0.05),0_4px_10px_-3px_rgba(36,40,44,0.14)]',
      )}
    >
      <h3 className="text-[15.5px] font-medium leading-[1.45] text-foreground">{task.title}</h3>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
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
    <time
      dateTime={value}
      className={cn(
        'mt-2 block text-[12.5px] leading-none',
        overdue ? 'font-medium text-urgent-dot' : 'text-muted-foreground',
      )}
    >
      {format(date, 'MMM d, yyyy')}
    </time>
  )
}
