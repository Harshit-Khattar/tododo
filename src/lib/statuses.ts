import type { TaskStatus } from '@/types/database'

interface StatusConfig {
  label: string
  /** Column background tint. */
  surface: string
  /** Status chip background. */
  chip: string
  /** Leading dot colour. */
  dot: string
  /** "New task" affordance text colour. */
  action: string
  /** Shown when the column has nothing in it. */
  empty: string
}

export const STATUSES: Record<TaskStatus, StatusConfig> = {
  urgent: {
    label: 'Urgent',
    surface: 'bg-urgent-surface',
    chip: 'bg-urgent-chip',
    dot: 'bg-urgent-dot',
    action: 'text-urgent-dot',
    empty: 'Nothing on fire.',
  },
  planned: {
    label: 'Planned',
    surface: 'bg-planned-surface',
    chip: 'bg-planned-chip',
    dot: 'bg-planned-dot',
    action: 'text-planned-dot',
    empty: 'Nothing queued up.',
  },
  ongoing: {
    label: 'Ongoing',
    surface: 'bg-ongoing-surface',
    chip: 'bg-ongoing-chip',
    dot: 'bg-ongoing-dot',
    action: 'text-ongoing-dot',
    empty: 'Nothing started.',
  },
  completed: {
    label: 'Completed',
    surface: 'bg-completed-surface',
    chip: 'bg-completed-chip',
    dot: 'bg-completed-dot',
    action: 'text-completed-dot',
    empty: 'Nothing finished yet.',
  },
}

export const STATUS_ORDER = Object.keys(STATUSES) as TaskStatus[]
