import { STATUSES } from '@/lib/statuses'
import { cn } from '@/lib/utils'
import type { TaskStatus } from '@/types/database'

export function StatusChip({ status, className }: { status: TaskStatus; className?: string }) {
  const { label, chip, dot } = STATUSES[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium',
        chip,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
