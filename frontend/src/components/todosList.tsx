"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

// Define types for props
interface TodosListProps {
  token: string;
  api: string;
}

// Define the Todo type (adjust based on your actual response structure)
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function TodosList({ token, api }: TodosListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPage] = useState<number>(1);
  const [isNext, setNext] = useState<boolean>(false);
  const [isPrev, setPrev] = useState<boolean>(false);

  const router = useRouter();

  async function getTodos() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}core/todos/?page=${pageNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      setNext(data.next !== null);
      setPrev(data.previous !== null);
      setTodos(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("An error occurred while fetching todos.");
    }
  }

  useEffect(() => {
    getTodos();
  }, [pageNumber]);

  async function handleCompletion(
    id: number,
    complete: boolean
  ): Promise<void> {
    const response = await fetch(`${api}core/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ completed: complete ? false : true }),
    });
    if (!response.ok) {
      console.log("Todo submit error: ", response.statusText);
    } else {
      await getTodos();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Todos List</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="items-center justify-center">
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {todos.length === 0 && !loading ? (
            <li className="text-gray-500">No todos available.</li>
          ) : (
            todos.map((todo: Todo) => (
              <li
                key={todo.id}
                className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex-grow">
                  <h2
                    className={`text-lg font-semibold ${
                      todo.completed
                        ? "text-green-600 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </h2>
                  <p className="text-gray-600">{todo.description}</p>
                </div>
                <div className="mt-2">
                  <span
                    onClick={() => handleCompletion(todo.id, todo.completed)}
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full cursor-pointer ${
                      todo.completed
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!isPrev}
          className={`px-4 py-2 rounded-md ${
            isPrev
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!isNext}
          className={`px-4 py-2 rounded-md ${
            isNext
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
