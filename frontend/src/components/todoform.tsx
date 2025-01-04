import { redirect } from "next/navigation";
import { TodoFromProps } from "@/types/todo";

export default function TodoForm({ token, api }: TodoFromProps) {
  async function handleSubmit(formData: FormData): Promise<void> {
    "use server";
    const title = formData.get("title");
    const description = formData.get("description");
    const response = await fetch(`${api}core/todos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      console.log("Todo submit error: ", response.statusText);
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex justify-center items-center">
      <form
        action={handleSubmit}
        className="flex space-x-4 items-center max-w-3xl text-gray-900 align-middle"
      >
        <div>
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            id="title"
            name="title"
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
            placeholder="Description"
            spellCheck={true}
            rows={1}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none align-middle"
          />
        </div>

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 align-middle"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
