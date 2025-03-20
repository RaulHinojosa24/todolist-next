import TodoList from "@/components/todo/list"
import NewTodo from "@/components/todo/new"
import { fetchTodoGroupInfo } from "@/lib/data"
import { UUID } from "crypto"

export async function generateMetadata(props: {
  params: Promise<{ id: UUID }>
}) {
  const { id } = await props.params
  const todoGroupData = await fetchTodoGroupInfo(id)

  return {
    title: "message" in todoGroupData ? "Error" : todoGroupData.name,
  }
}

export default async function TodoGroupPage(props: {
  params: Promise<{ id: UUID }>
}) {
  const { id } = await props.params
  const todoGroupData = await fetchTodoGroupInfo(id)

  return (
    <>
      {"id" in todoGroupData ? (
        <div className="w-full space-y-4">
          <h1>{todoGroupData.name}</h1>
          {todoGroupData.description && (
            <p className="text-center text-sm text-muted-foreground">
              {todoGroupData.description}
            </p>
          )}
          <NewTodo todoGroupId={id}></NewTodo>
          <TodoList todoGroupId={id} />
        </div>
      ) : (
        <>
          <p>{todoGroupData.message}</p>
        </>
      )}
    </>
  )
}
