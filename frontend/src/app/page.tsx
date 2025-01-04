import { cookies } from "next/headers";
import TodosList from "@/components/todosList";
import { redirect } from "next/navigation";
import TodoForm from "@/components/todoform";

export default async function Home() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access-token")?.value || "";
  if (!accessToken) {
    // Check for refreash token and refreash it if possiable || And make both tokens and antything coockie-able in one cookie
    // Also logout functionality
    redirect("login/");
  }
  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || "";

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section>
          <TodoForm token={accessToken} api={apiUrl} />
        </section>

        <section>
          <TodosList token={accessToken} api={apiUrl} />
        </section>
      </main>
    </div>
  );
}
