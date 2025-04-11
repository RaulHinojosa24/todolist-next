import { UUID } from "crypto"

export type TaskGroup = {
  id: UUID
  name: string
  description: string
  customer_id: UUID
}

export type TaskGroupCounts = TaskGroup & {
  completed_count: number
  total_count: number
}

export type TaskItem = {
  id: UUID
  text: string
  task_group_id: UUID
  completed: boolean
  creation_date: Date
}

export type User = {
  id: UUID
  name: string
  username: string
  password: string
}
