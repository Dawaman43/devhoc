import fs from 'node:fs'
import { createServerFn } from '@tanstack/react-start'

const TODOS_FILE = 'todos.json'

type Todo = {
  id: number
  name: string
  completed: boolean
}

async function readTodos(): Promise<Array<Todo>> {
  return JSON.parse(
    await fs.promises.readFile(TODOS_FILE, 'utf-8').catch(() =>
      JSON.stringify(
        [
          { id: 1, name: 'Learn TanStack Router', completed: false },
          { id: 2, name: 'Build a todo app', completed: false },
        ],
        null,
        2,
      ),
    ),
  )
}

export const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => await readTodos())

// export const addTodo = createServerFn({ method: 'POST' })
//   .inputValidator((d: string) => d)
//   .handler(async ({ data }) => {
//     const todos = await readTodos()
//     const newTodo: Todo = {
//       id: Date.now(), // better id
//       name: data,
//       completed: false,
//     }
//     todos.push(newTodo)
//     await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
//     return newTodo
//   })

export const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const todos = await readTodos()
    const todo_length = todos.length

    const new_todo: Todo = {
      id: todo_length + 1,
      name: data,
      completed: false,
    }

    todos.push(new_todo)

    await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
    return new_todo
  })

export const toggleTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: number) => d)
  .handler(async ({ data: id }) => {
    const todos = await readTodos()
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
      await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
      return todo
    }
    throw new Error('Todo not found')
  })

export const deleteTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: number) => d)
  .handler(async ({ data: id }) => {
    const todos = await readTodos()
    const index = todos.findIndex((t) => t.id === id)
    if (index !== -1) {
      todos.splice(index, 1)
      await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
      return true
    }
    throw new Error('Todo not found')
  })
