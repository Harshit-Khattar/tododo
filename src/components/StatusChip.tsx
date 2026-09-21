import { STATUSES } from '@/lib/statuses'
import { cn } from '@/lib/utils'
import type { TaskStatus } from '@/types/database'

export function StatusChip({ status, className }: { status: TaskStatus; className?: string }) {
  const { label, chip, dot } = STATUSES[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[3px] px-1.5 py-[3px] text-[11.5px] font-medium leading-none',
        chip,
        className,
      )}
    >
      <span className={cn('size-[5px] rounded-full', dot)} />
      {label}
    </span>
  )
}
