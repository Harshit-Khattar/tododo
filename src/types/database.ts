export type TaskStatus = 'urgent' | 'planned' | 'ongoing' | 'completed'

export type Task = {
  id: string
  title: string
  notes: string | null
  status: TaskStatus
  tags: string[]
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
}

export type TaskInsert = Pick<Task, 'title'> &
  Partial<Pick<Task, 'notes' | 'status' | 'tags' | 'due_date' | 'position'>>

export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>

export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'

export type Note = {
  id: string
  content: string
  done: boolean
  bold: boolean
  color: NoteColor
  position: number
  created_at: string
  updated_at: string
}

export type NoteInsert = Pick<Note, 'content'> &
  Partial<Pick<Note, 'done' | 'bold' | 'color' | 'position'>>

export type NoteUpdate = Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: TaskInsert
        Update: TaskUpdate
        Relationships: []
      }
      notes: {
        Row: Note
        Insert: NoteInsert
        Update: NoteUpdate
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { task_status: TaskStatus; note_color: NoteColor }
    CompositeTypes: { [_ in never]: never }
  }
}
