"use client";
import { useState } from "react";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createTodo(title: string, description: string) {
    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(response.statusText || "Something went wrong");
      }
      setTitle("");
      setDescription("");
      setError(null);
    } catch (err) {
      setError("Error creating todo. Please try again.");
      console.error("Todo submit error: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title || !description) {
      setError("Please fill out both the title and description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    await createTodo(title, description);
    window.location.reload();
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex space-x-4 items-center max-w-3xl text-gray-900 align-middle"
      >
        <div>
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            spellCheck={true}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 align-middle"
          />
        </div>

        <div>
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            spellCheck={true}
            rows={1}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none align-middle"
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 align-middle"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <div className="text-red-500 mt-2 p-4">{error}</div>}
    </div>
  );
}
