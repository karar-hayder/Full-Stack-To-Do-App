"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TodoEdit({ todo_id }: { todo_id: number }) {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [todoCompleted, setTodoCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  async function updateTodo(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    try {
      console.log(todoCompleted);
      const response = await fetch("/api/todo/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo_id,
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

  async function getTodo() {
    const response = await fetch(`/api/todo/${todo_id}`, {
      method: "GET",
      headers: {},
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) {
      if (response.status == 401) {
        router.push("/login");
        return;
      }
      setError("An error occurred while fetching todos.");
      setError(`Failed to fetch todos: ${response.statusText}`);
      return;
    }
    const data = await response.json();
    setTodoTitle(data.title);
    setTodoDescription(data.description);
    setTodoCompleted(data.completed);
    setError(null);
  }
  useEffect(() => {
    getTodo();
  }, [todo_id]);
  return (
    <div className="flex flex-col justify-center items-center z-10 p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-40">
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
      {error && <div className="text-red-500 mt-2 p-4">{error}</div>}
    </div>
  );
}
