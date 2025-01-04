import TodoEdit from "@/components/todoedit";
import { Todo } from "@/types/todo";
import { getToken } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const token = await getToken();

  if (!token) {
    redirect("/login/");
  }
  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || "";
  const myTodo: Todo = await fetch(`${apiUrl}core/todos/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      console.log("Todo update error: ", response.statusText);
      throw new Error(response.statusText);
    } else {
      return response.json();
    }
  });

  return (
    <TodoEdit token={token.accessToken} api={apiUrl} todo={myTodo}></TodoEdit>
  );
}
