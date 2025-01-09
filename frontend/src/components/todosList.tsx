"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Todo } from "@/types/todo";

export default function TodosList() {
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
      const response = await fetch(`/api/todo/?page=${pageNumber}`, {
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
    title: string,
    description: string,
    complete: boolean
  ): Promise<void> {
    const response = await fetch("/api/todo/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        completed: complete ? false : true,
      }),
    });
    if (!response.ok) {
      console.log("Todo completion error: ", response.statusText);
    } else {
      await getTodos();
    }
  }
  async function HandleDeletion(id: number) {
    const response = await fetch("/api/todo/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
      console.log("Todo deletion error: ", response.statusText);
    } else {
      await getTodos();
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Todos List
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {todos.length === 0 && !loading ? (
              <li className="col-span-full text-center text-gray-500">
                No todos available.
              </li>
            ) : (
              todos.map((todo: Todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col p-8 border border-gray-200 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
                >
                  <div className="flex-grow">
                    <h2
                      className={`text-xl font-semibold cursor-pointer ${
                        todo.completed
                          ? "text-green-600 line-through"
                          : "text-gray-800 hover:text-indigo-600"
                      }`}
                      onClick={() => router.push(`/edit/${todo.id}`)}
                    >
                      {todo.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {todo.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span
                      onClick={() =>
                        handleCompletion(
                          todo.id,
                          todo.title,
                          todo.description,
                          todo.completed
                        )
                      }
                      className={`inline-block px-4 py-1 text-sm font-medium rounded-full cursor-pointer ${
                        todo.completed
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => HandleDeletion(todo.id)}
                      className="px-4 py-1 text-sm font-medium rounded-full bg-red-200 text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!isPrev}
          className={`px-6 py-2 rounded-md text-lg font-semibold transition-all ${
            isPrev
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!isNext}
          className={`px-6 py-2 rounded-md text-lg font-semibold transition-all ${
            isNext
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
