"use server"

import { sql } from "@vercel/postgres"
import type { UUID } from "crypto"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { TaskGroup } from "./definitions"
import {
  TASK_GROUP_DESCRIPTION_MAX_LENGTH,
  TASK_GROUP_NAME_MAX_LENGTH,
  TASK_ITEM_MAX_LENGTH,
} from "./constants"
import { encrypt } from "./encryption"
import bcrypt from "bcrypt"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

const PasswordSchema = z
  .string({
    message: "Password is required.",
  })
  .trim()
  .min(8, {
    message: "Password must be at least 8 characters long.",
  })
  .refine((val) => !/\s/.test(val), {
    message: "Password must not contain spaces.",
  })

export type DefaultState = {
  errors?: string[]
  message?: string | null
}

export async function confirmPassword(
  prevState: DefaultState | undefined | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      errors: ["Session expired. Please log in again."],
    }
  }

  const formPassw = formData.get("current-password")

  try {
    const parsedPassw = PasswordSchema.safeParse(formPassw)

    if (!parsedPassw.success) {
      return {
        errors: parsedPassw.error.flatten().formErrors,
        message: "Invalid password.",
      }
    }

    const password = parsedPassw.data

    const {
      rows: [customer],
    } = await sql`
      SELECT password
      FROM customer
      WHERE id = ${session.user.id}
      `

    if (!customer) {
      return {
        errors: ["User not found."],
      }
    }

    const passwordsMatch = await bcrypt.compare(password, customer.password)

    if (!passwordsMatch) {
      return {
        errors: ["Incorrect password."],
      }
    }

    return null
  } catch (error) {
    console.error(error)
    return {
      errors: ["Database error. Please try again."],
    }
  }
}

export async function updateCustomerPassword(
  prevState: DefaultState | undefined | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      errors: ["Session expired. Please log in again."],
    }
  }

  const newPassw = formData.get("new-password")
  const confirmPassw = formData.get("confirm-password")

  if (newPassw !== confirmPassw) {
    return {
      errors: ["Passwords do not match."],
    }
  }

  try {
    const parsedPassw = PasswordSchema.safeParse(newPassw)

    if (!parsedPassw.success) {
      return {
        errors: parsedPassw.error.flatten().formErrors,
        message: "Invalid password.",
      }
    }

    const password = parsedPassw.data

    const {
      rows: [customer],
    } = await sql`
      SELECT password
      FROM customer
      WHERE id = ${session.user.id}
      `

    if (!customer) {
      return {
        errors: ["User not found."],
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await sql`
      UPDATE customer
      SET password = ${hashedPassword}
      WHERE id = ${session.user.id}
    `

    return null
  } catch (error) {
    console.error(error)
    return {
      errors: ["Database error. Please try again."],
    }
  }
}

const TaskItemFormSchema = z.object({
  id: z.string().uuid(),
  taskGroupId: z.string().uuid(),
  completed: z.boolean(),
  task: z
    .string()
    .trim()
    .min(1, {
      message: "Oops! Looks like you forgot to enter something.",
    })
    .max(TASK_ITEM_MAX_LENGTH, {
      message:
        "Oops! Your text is too long. Please keep it under 100 characters.",
    }),
  creationDate: z.string().datetime(),
})

export type TaskItemState = {
  errors?: {
    task?: string[]
  }
  message?: string | null
}

// TASK ITEM

export async function updateTaskItemCompleted(id: UUID, newCompleted: boolean) {
  try {
    await sql`
      UPDATE task_item
      SET completed = ${newCompleted}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database Error: Failed to Update Task Item.")
  }

  revalidatePath("/")
}

const CreateTask = TaskItemFormSchema.omit({
  id: true,
  taskGroupId: true,
  completed: true,
  creationDate: true,
})

export async function createTaskItem(
  taskGroupId: UUID,
  prevState: TaskItemState | undefined,
  formData: FormData
) {
  const validatedFields = CreateTask.safeParse({
    task: formData.get("task"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Task Item.",
    }
  }

  const { task } = validatedFields.data
  const encryptedTask = encrypt(task)

  try {
    await sql`
      INSERT INTO task_item (text, task_group_id)
      VALUES (${encryptedTask}, ${taskGroupId})
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    return {
      errors: {},
      message: "Database Error: Failed to Create Task Item.",
    }
  }

  revalidatePath("/")
}

const EditTask = TaskItemFormSchema.omit({
  taskGroupId: true,
  completed: true,
  creationDate: true,
})

export async function editTaskItem(
  rawId: UUID,
  prevState: TaskItemState | undefined,
  formData: FormData
) {
  const validatedFields = EditTask.safeParse({
    id: rawId,
    task: formData.get("task"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Task Item.",
    }
  }

  const { id, task } = validatedFields.data
  const encryptedTask = encrypt(task)

  try {
    await sql`
      UPDATE task_item
      SET text = ${encryptedTask}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    return {
      errors: {},
      message: "Database Error: Failed to Update Task Item.",
    }
  }

  revalidatePath("/")
}

export async function deleteTaskItem(id: UUID) {
  try {
    await sql`
      DELETE FROM task_item
      WHERE id = ${id};
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database error: Failed to delete task.")
  }

  revalidatePath("/")
}

// TASK GROUP

const TaskGroupFormSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Oops! Looks like you forgot to enter something.",
    })
    .max(TASK_GROUP_NAME_MAX_LENGTH, {
      message:
        "Oops! Group name is too long. Please keep it under 50 characters.",
    }),
  description: z.string().trim().max(TASK_GROUP_DESCRIPTION_MAX_LENGTH, {
    message:
      "Oops! Your description is too long. Please keep it under 200 characters.",
  }),
  creationDate: z.string().datetime(),
})

export type TaskGroupState = {
  errors?: {
    name?: string[]
    description?: string[]
  }
  message?: string | null
  id?: UUID
}

const CreateTaskGroup = TaskGroupFormSchema.omit({
  id: true,
  customerId: true,
  creationDate: true,
})

export async function createTaskGroup(
  prevState: TaskGroupState | undefined,
  formData: FormData
) {
  const validatedFields = CreateTaskGroup.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Task Group.",
    }
  }

  const { name, description } = validatedFields.data
  const encryptedName = encrypt(name)
  const encryptedDescription = encrypt(description)

  try {
    const session = await auth()

    const { rows } = await sql<TaskGroup>`
      INSERT INTO task_group (name, description, customer_id)
      VALUES (${encryptedName}, ${encryptedDescription}, ${session?.user?.id})
      RETURNING id
    `
    revalidatePath("/tasks")
    return { id: rows[0].id }
  } catch (error) {
    console.error(error)
    return {
      errors: {},
      message: "Database Error: Failed to Create Task Group.",
    }
  }
}

const EditTaskGroup = TaskGroupFormSchema.omit({
  creationDate: true,
  customerId: true,
})

export async function editTaskGroup(
  rawId: UUID,
  prevState: TaskGroupState | undefined,
  formData: FormData
) {
  const validatedFields = EditTaskGroup.safeParse({
    id: rawId,
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields: Failed to update task group.",
    }
  }

  const { id, name, description } = validatedFields.data
  const encryptedName = encrypt(name)
  const encryptedDescription = encrypt(description)

  try {
    await sql`
      UPDATE task_group
      SET name = ${encryptedName}, description = ${encryptedDescription}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    return {
      errors: {},
      message: "Database error: Failed to update task group.",
    }
  }

  revalidatePath("/tasks")
}

export async function deleteTaskGroup(id: UUID) {
  try {
    await sql`
      DELETE FROM task_group
      WHERE id = ${id};
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database error: Failed to delete task group.")
  }

  revalidatePath("/tasks")
}
