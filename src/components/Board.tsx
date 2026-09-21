import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'

import { Column } from '@/components/Column'
import { TaskCardBody } from '@/components/TaskCard'
import { TaskDialog } from '@/components/TaskDialog'
import { useTasks, useUpdateTask } from '@/hooks/useTasks'
import { positionAt } from '@/lib/position'
import { STATUS_ORDER } from '@/lib/statuses'
import type { Task, TaskStatus } from '@/types/database'

export function Board() {
  const { data: tasks = [], isPending, error } = useTasks()
  const updateTask = useUpdateTask()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Task | null>(null)
  const [composingIn, setComposingIn] = useState<TaskStatus | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const columns = useMemo(() => {
    const grouped = Object.fromEntries(STATUS_ORDER.map((s) => [s, [] as Task[]])) as Record<
      TaskStatus,
      Task[]
    >
    for (const task of tasks) grouped[task.status].push(task)
    return grouped
  }, [tasks])

  const nextPosition = (status: TaskStatus) => positionAt(columns[status], columns[status].length)

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    const task = tasks.find((t) => t.id === active.id)
    const status = over.data.current?.status as TaskStatus | undefined
    if (!task || !status) return

    const siblings = columns[status].filter((t) => t.id !== task.id)
    const overIndex = siblings.findIndex((t) => t.id === over.id)
    const position = positionAt(siblings, overIndex === -1 ? siblings.length : overIndex)

    if (task.status === status && task.position === position) return
    updateTask.mutate({ id: task.id, status, position })
  }

  if (error) {
    return <p className="p-8 text-sm text-urgent-dot">Could not load tasks: {error.message}</p>
  }

  const activeTask = tasks.find((task) => task.id === activeId) ?? null

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }: DragStartEvent) => setActiveId(String(active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto px-10 pb-12">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={columns[status]}
              onOpen={setEditing}
              onNew={setComposingIn}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-1">
              <TaskCardBody task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {isPending && <p className="px-10 text-sm text-muted-foreground">Loading…</p>}

      <TaskDialog
        open={Boolean(editing) || Boolean(composingIn)}
        task={editing}
        status={editing?.status ?? composingIn ?? 'planned'}
        nextPosition={nextPosition}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            setComposingIn(null)
          }
        }}
      />
    </>
  )
}
