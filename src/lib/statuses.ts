import type { TaskStatus } from '@/types/database'

interface StatusConfig {
  label: string
  /** Column background tint. */
  surface: string
  /** Status chip background. */
  chip: string
  /** Leading dot colour. */
  dot: string
  /** "New" affordance text colour. */
  action: string
}

export const STATUSES: Record<TaskStatus, StatusConfig> = {
  urgent: {
    label: 'Urgent',
    surface: 'bg-urgent-surface',
    chip: 'bg-urgent-chip',
    dot: 'bg-urgent-dot',
    action: 'text-urgent-dot',
  },
  planned: {
    label: 'Planned',
    surface: 'bg-planned-surface',
    chip: 'bg-planned-chip',
    dot: 'bg-planned-dot',
    action: 'text-planned-dot',
  },
  ongoing: {
    label: 'Ongoing',
    surface: 'bg-ongoing-surface',
    chip: 'bg-ongoing-chip',
    dot: 'bg-ongoing-dot',
    action: 'text-ongoing-dot',
  },
  completed: {
    label: 'Completed',
    surface: 'bg-completed-surface',
    chip: 'bg-completed-chip',
    dot: 'bg-completed-dot',
    action: 'text-completed-dot',
  },
}

export const STATUS_ORDER = Object.keys(STATUSES) as TaskStatus[]
