"use server"

import { sql } from "@vercel/postgres"
import type { UUID } from "crypto"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import { TodoGroup } from "./definitions"
import {
  TODO_GROUP_DESCRIPTION_MAX_LENGTH,
  TODO_GROUP_NAME_MAX_LENGTH,
  TODO_ITEM_MAX_LENGTH,
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

const TodoItemFormSchema = z.object({
  id: z.string().uuid(),
  todoGroupId: z.string().uuid(),
  completed: z.boolean(),
  todo: z
    .string()
    .trim()
    .min(1, {
      message: "Oops! Looks like you forgot to enter something.",
    })
    .max(TODO_ITEM_MAX_LENGTH, {
      message:
        "Oops! Your text is too long. Please keep it under 100 characters.",
    }),
  creationDate: z.string().datetime(),
})

export type TodoItemState = {
  errors?: {
    todo?: string[]
  }
  message?: string | null
}

// TODO ITEM

export async function updateTodoItemCompleted(id: UUID, newCompleted: boolean) {
  try {
    await sql`
      UPDATE todo_item
      SET completed = ${newCompleted}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database Error: Failed to Update Todo Item.")
  }

  revalidatePath("/")
}

const CreateTodo = TodoItemFormSchema.omit({
  id: true,
  todoGroupId: true,
  completed: true,
  creationDate: true,
})

export async function createTodoItem(
  todoGroupId: UUID,
  prevState: TodoItemState | undefined,
  formData: FormData
) {
  const validatedFields = CreateTodo.safeParse({
    todo: formData.get("todo"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Todo Item.",
    }
  }

  const { todo } = validatedFields.data
  const encryptedTodo = encrypt(todo)

  try {
    await sql`
      INSERT INTO todo_item (text, todo_group_id)
      VALUES (${encryptedTodo}, ${todoGroupId})
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    return {
      errors: {},
      message: "Database Error: Failed to Create Todo Item.",
    }
  }

  revalidatePath("/")
}

const EditTodo = TodoItemFormSchema.omit({
  todoGroupId: true,
  completed: true,
  creationDate: true,
})

export async function editTodoItem(
  rawId: UUID,
  prevState: TodoItemState | undefined,
  formData: FormData
) {
  const validatedFields = EditTodo.safeParse({
    id: rawId,
    todo: formData.get("todo"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Todo Item.",
    }
  }

  const { id, todo } = validatedFields.data
  const encryptedTodo = encrypt(todo)

  try {
    await sql`
      UPDATE todo_item
      SET text = ${encryptedTodo}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    return {
      errors: {},
      message: "Database Error: Failed to Update Todo Item.",
    }
  }

  revalidatePath("/")
}

export async function deleteTodoItem(id: UUID) {
  try {
    await sql`
      DELETE FROM todo_item
      WHERE id = ${id};
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database error: Failed to delete task.")
  }

  revalidatePath("/")
}

// TODO GROUP

const TodoGroupFormSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Oops! Looks like you forgot to enter something.",
    })
    .max(TODO_GROUP_NAME_MAX_LENGTH, {
      message:
        "Oops! Group name is too long. Please keep it under 50 characters.",
    }),
  description: z.string().trim().max(TODO_GROUP_DESCRIPTION_MAX_LENGTH, {
    message:
      "Oops! Your description is too long. Please keep it under 200 characters.",
  }),
  creationDate: z.string().datetime(),
})

export type TodoGroupState = {
  errors?: {
    name?: string[]
    description?: string[]
  }
  message?: string | null
  id?: UUID
}

const CreateTodoGroup = TodoGroupFormSchema.omit({
  id: true,
  customerId: true,
  creationDate: true,
})

export async function createTodoGroup(
  prevState: TodoGroupState | undefined,
  formData: FormData
) {
  const validatedFields = CreateTodoGroup.safeParse({
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

    const { rows } = await sql<TodoGroup>`
      INSERT INTO todo_group (name, description, customer_id)
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

const EditTodoGroup = TodoGroupFormSchema.omit({
  creationDate: true,
  customerId: true,
})

export async function editTodoGroup(
  rawId: UUID,
  prevState: TodoGroupState | undefined,
  formData: FormData
) {
  const validatedFields = EditTodoGroup.safeParse({
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
      UPDATE todo_group
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

export async function deleteTodoGroup(id: UUID) {
  try {
    await sql`
      DELETE FROM todo_group
      WHERE id = ${id};
    `
  } catch (error) {
    console.error(error)
    // If a database error occurs, return a more specific error.
    throw new Error("Database error: Failed to delete task group.")
  }

  revalidatePath("/tasks")
}
