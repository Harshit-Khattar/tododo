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

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: TaskInsert
        Update: TaskUpdate
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { task_status: TaskStatus }
    CompositeTypes: { [_ in never]: never }
  }
}
