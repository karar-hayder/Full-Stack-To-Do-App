"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
  async function handleLogin(formData: FormData): Promise<void> {
    const username = formData.get("username") as string | null;
    const password = formData.get("password") as string | null;

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);
    if (response.ok) {
      const tokens = await response.json();
      login(tokens.access, tokens.refresh);
      router.push("/");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleLogin(formData);
          }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold">Login</h1>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
        <a href="register/">Don't have an account?</a>
      </main>
    </div>
  );
}
