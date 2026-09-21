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
  const { surface, action } = STATUSES[status]

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex w-72 shrink-0 flex-col gap-2 rounded-lg p-2 transition-colors',
        surface,
        isOver && 'ring-2 ring-accent/30',
      )}
    >
      <header className="flex items-center gap-2 px-1 py-1">
        <StatusChip status={status} />
        <span className="text-sm text-muted-foreground">{tasks.length}</span>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} />
          ))}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onNew(status)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium opacity-70 transition-opacity hover:opacity-100',
          action,
        )}
      >
        <Plus className="size-4" />
        New task
      </button>
    </section>
  )
}
