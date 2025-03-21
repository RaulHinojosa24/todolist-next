import { sql } from "@vercel/postgres"
import type { TodoGroup, TodoGroupCounts, TodoItem } from "./definitions"
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
    const data = await sql<TodoGroupCounts>`
      SELECT tg.*, 
       COUNT(ti.id) as total_count,
       COUNT(CASE WHEN ti.completed THEN 1 END) as completed_count
      FROM todo_group tg
      LEFT JOIN todo_item ti ON tg.id = ti.todo_group_id
      WHERE tg.customer_id = ${session?.user?.id}
      GROUP BY tg.id
      ORDER BY tg.name`

    return data.rows
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your task groups.",
    }
  }
}

export async function fetchTodoItems(todoGroupId: UUID) {
  const validatedId = zUUID.safeParse(todoGroupId)

  if (!validatedId.success) {
    return {
      message: "Invalid identifier.",
    }
  }

  try {
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
