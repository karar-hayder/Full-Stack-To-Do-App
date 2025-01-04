import TodoEdit from "@/components/todoedit";
import { Todo } from "@/types/todo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access-token")?.value || "";
  if (!accessToken) {
    // Check for refreash token and refreash it if possiable || And make both tokens and antything coockie-able in one cookie
    // Also logout functionality
    redirect("login/");
  }
  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || "";
  const myTodo: Todo = await fetch(`${apiUrl}core/todos/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
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

  return <TodoEdit token={accessToken} api={apiUrl} todo={myTodo}></TodoEdit>;
}
