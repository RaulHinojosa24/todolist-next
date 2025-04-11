import { sql } from "@vercel/postgres"
import type { TaskGroupCounts, TaskItem } from "./definitions"
import { auth } from "@/auth"
import { UUID } from "crypto"
import { z } from "zod"
import { decrypt } from "./encryption"

const zUUID = z.string().uuid()

export async function fetchTaskGroupInfo(taskGroupId: UUID) {
  const session = await auth()

  const validatedId = zUUID.safeParse(taskGroupId)

  if (!validatedId.success) {
    return {
      message: "Invalid identifier.",
    }
  }

  try {
    const { rows } = await sql<TaskGroupCounts>`
    SELECT tg.*, 
      COUNT(ti.id) as total_count,
      COUNT(CASE WHEN ti.completed THEN 1 END) as completed_count,
      COUNT(CASE WHEN ti.completed THEN NULL ELSE 1 END) as incomplete_count
    FROM task_group tg
    LEFT JOIN task_item ti ON tg.id = ti.task_group_id
    WHERE tg.id = ${taskGroupId}
    AND tg.customer_id = ${session?.user?.id}
    GROUP BY tg.id`

    if (!rows[0]) {
      return {
        message: "The task group you're trying to access do not exist!",
      }
    }

    const decryptedData = {
      ...rows[0],
      name: decrypt(rows[0].name),
      description: decrypt(rows[0].description),
    }

    return decryptedData
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your task group info.",
    }
  }
}

export async function fetchTaskGroups() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      message: "Not authenticated.",
    }
  }

  try {
    const data = await sql<TaskGroupCounts>`
      SELECT tg.*, 
       COUNT(ti.id) as total_count,
       COUNT(CASE WHEN ti.completed THEN 1 END) as completed_count
      FROM task_group tg
      LEFT JOIN task_item ti ON tg.id = ti.task_group_id
      WHERE tg.customer_id = ${session?.user?.id}
      GROUP BY tg.id
      ORDER BY tg.name
    `

    const decryptedData = data.rows.map((group) => ({
      ...group,
      name: decrypt(group.name),
      description: decrypt(group.description),
    }))

    return decryptedData
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your task groups.",
    }
  }
}

export async function fetchTaskItems(taskGroupId: UUID) {
  const validatedId = zUUID.safeParse(taskGroupId)

  if (!validatedId.success) {
    return {
      message: "Invalid identifier.",
    }
  }

  try {
    const data = await sql<TaskItem>`
        SELECT *
        FROM task_item
        WHERE task_group_id = ${taskGroupId}
        ORDER BY completed, creation_date DESC`

    const decryptedData = data.rows.map((item) => ({
      ...item,
      text: decrypt(item.text),
    }))

    return decryptedData
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Failed to fetch your tasks.",
    }
  }
}
