import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { StatusChip } from '@/components/StatusChip'
import { TaskCard } from '@/components/TaskCard'
import { STATUSES } from '@/lib/statuses'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/database'

interface ColumnProps {
  status: TaskStatus
  tasks: Task[]
  onOpen: (task: Task) => void
  onNew: (status: TaskStatus) => void
}

export function Column({ status, tasks, onOpen, onNew }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } })
  const { surface, ink, empty } = STATUSES[status]

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex w-[17.5rem] shrink-0 flex-col gap-2 rounded-[10px] border border-border/60 p-2',
        'transition-shadow duration-150',
        surface,
        isOver && 'border-accent/40 shadow-[inset_0_0_0_1px_var(--color-accent)]',
      )}
    >
      <header className="flex items-center gap-2 px-1 pb-0.5 pt-1">
        <StatusChip status={status} />
        <span data-numeric className={cn('text-[12.5px] font-medium', ink)}>
          {tasks.length}
        </span>
      </header>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-10 flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <p className="px-3 py-2 text-[13.5px] text-muted-foreground/75">
          {empty}
        </p>
      )}

      <button
        type="button"
        onClick={() => onNew(status)}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-2 text-[13.5px] font-medium',
          'opacity-65 transition-opacity duration-150 hover:opacity-100',
          'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1',
          ink,
        )}
      >
        <Plus className="size-3.5" />
        New task
      </button>
    </section>
  )
}
