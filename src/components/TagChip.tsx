import { X } from 'lucide-react'

export function TagChip({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
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
