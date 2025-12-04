import { Check, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addTodo, deleteTodo, getTodos, toggleTodo } from '../server/todos'

type Todo = {
  id: number
  name: string
  completed: boolean
}

export function TodoList() {
  const queryClient = useQueryClient()
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const [newTodo, setNewTodo] = useState('')

  const handleAdd = () => {
    if (newTodo.trim()) {
      addMutation.mutate({ data: newTodo.trim() })
      setNewTodo('')
    }
  }

  const handleToggle = (id: number) => {
    toggleMutation.mutate({ data: id })
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ data: id })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          disabled={!newTodo.trim() || addMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <button
                onClick={() => handleToggle(todo.id)}
                className={`w-5 h-5 mr-3 border-2 rounded flex items-center justify-center ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {todo.completed && <Check size={12} className="text-white" />}
              </button>
              <span
                className={`${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.name}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
