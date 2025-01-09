"use client";

import TodosList from "@/components/todosList";
import { useRouter } from "next/navigation";
import TodoForm from "@/components/todoform";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>
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
