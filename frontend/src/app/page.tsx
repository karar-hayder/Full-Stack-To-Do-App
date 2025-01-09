import TodosList from "@/components/todosList";
import { redirect } from "next/navigation";
import TodoForm from "@/components/todoform";
import { getToken } from "@/lib/auth";

export default async function Home() {
  const token = await getToken();
  if (!token) {
    redirect("login/");
  }
  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || "";

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section>
          <TodoForm />
        </section>

        <section>
          <TodosList />
        </section>
      </main>
    </div>
  );
}
