import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

export function TagChip({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[3px] border border-border px-1.5 py-[3px]',
        'text-[11.5px] leading-none text-muted-foreground',
      )}
    >
      {tag}
      {onRemove && (
        <button type="button" onClick={onRemove} className="transition-opacity hover:opacity-60">
          <X className="size-3" />
          <span className="sr-only">Remove {tag}</span>
        </button>
      )}
    </span>
  )
}
