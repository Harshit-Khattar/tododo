import type { NoteColor } from '@/types/database'

/**
 * Literal class strings, not interpolated — Tailwind scans source text, so a
 * computed `text-note-${color}` would never make it into the stylesheet.
 */
export const NOTE_COLORS: Record<NoteColor, { label: string; text: string; swatch: string }> = {
  default: { label: 'Default', text: 'text-foreground', swatch: 'bg-foreground' },
  red: { label: 'Red', text: 'text-note-red', swatch: 'bg-note-red' },
  orange: { label: 'Orange', text: 'text-note-orange', swatch: 'bg-note-orange' },
  yellow: { label: 'Yellow', text: 'text-note-yellow', swatch: 'bg-note-yellow' },
  green: { label: 'Green', text: 'text-note-green', swatch: 'bg-note-green' },
  blue: { label: 'Blue', text: 'text-note-blue', swatch: 'bg-note-blue' },
  purple: { label: 'Purple', text: 'text-note-purple', swatch: 'bg-note-purple' },
}

export const NOTE_COLOR_ORDER = Object.keys(NOTE_COLORS) as NoteColor[]
