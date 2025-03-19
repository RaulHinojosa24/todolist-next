import { UUID } from "crypto"

export type TodoGroup = {
  id: UUID
  name: string
  description: string
  customer_id: UUID
}

export type TodoItem = {
  id: UUID
  text: string
  todo_group_id: UUID
  completed: boolean
  creation_date: Date
}

export type User = {
  id: UUID
  name: string
  username: string
  password: string
}
