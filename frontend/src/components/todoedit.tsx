"use client";
import { Todo, TodoEditProps } from "@/types/todo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TodoEdit({ token, api, todo }: TodoEditProps) {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoDescription, setTodoDescription] = useState(todo.description);
  const [todoCompleted, setTodoCompleted] = useState(todo.completed);

  const router = useRouter();
  async function updateTodo(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    try {
      const response = await fetch(`${api}core/todos/${todo.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title: todoTitle,
          description: todoDescription,
          completed: todoCompleted,
        }),
      });
      if (!response.ok) {
        console.log("Todo update error: ", response.statusText);
      } else {
        console.log("Todo updated");
        router.push("/");
      }
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center z-10 p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Todo</h1>
      <form onSubmit={updateTodo} className="w-full space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-lg font-medium">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-lg font-medium">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="completed" className="text-lg font-medium">
            Completed:
          </label>
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={todoCompleted}
            onChange={(e) => setTodoCompleted(e.target.checked)}
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
