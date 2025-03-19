import { sql } from "@vercel/postgres"
import type { TodoGroup, TodoItem } from "./definitions"
import { auth } from "@/auth"
import { UUID } from "crypto"
import { z } from "zod"

const zUUID = z.string().uuid()

export async function fetchTodoGroupInfo(todoGroupId: UUID) {
  const session = await auth()

  const validatedId = zUUID.safeParse(todoGroupId)

  if (!validatedId.success) {
    return {
      message: "Invalid identifier.",
    }
  }

  try {
    const { rows } = await sql<TodoGroup>`
    SELECT *
    FROM todo_group
    WHERE id = ${todoGroupId}
    AND customer_id = ${session?.user?.id}`

    if (!rows[0]) {
      return {
        message: "The task group you're trying to access do not exist!",
      }
    }

    return rows[0]
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your task group info.",
    }
  }
}

export async function fetchTodoGroups() {
  const session = await auth()

  try {
    const data = await sql<TodoGroup>`
        SELECT *
        FROM todo_group
        WHERE customer_id = ${session?.user?.id}
        ORDER BY name`

    return data.rows
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your task groups.",
    }
  }
}

export async function fetchTodoItems(todoGroupId: UUID) {
  const session = await auth()

  const validatedId = zUUID.safeParse(todoGroupId)

  if (!validatedId.success) {
    return {
      message: "Invalid identifier.",
    }
  }

  try {
    const { rowCount: todoGroupExists } = await sql<TodoGroup>`
    SELECT *
    FROM todo_group
    WHERE id = ${todoGroupId}
    AND customer_id = ${session?.user?.id}`

    if (todoGroupExists === 0) {
      return {
        message: "The tasks you're trying to access do not exist!",
      }
    }

    const data = await sql<TodoItem>`
        SELECT *
        FROM todo_item
        WHERE todo_group_id = ${todoGroupId}
        ORDER BY completed, creation_date DESC`

    return data.rows
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your tasks.",
    }
  }
}
