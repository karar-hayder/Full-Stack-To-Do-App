import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setToken } from "@/lib/auth";

export default function Login() {
  async function handleLogin(formData: FormData): Promise<void> {
    "use server";

    const username = formData.get("username") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !password) {
      console.error("Username and password are required.");
      return;
    }

    try {
      const apiUrl = process.env.DJANGO_PUBLIC_API_URL;

      if (!apiUrl) {
        console.error("API URL is not defined in the environment variables.");
        return;
      }
      console.log(`${apiUrl}users/register/`);
      const response = await fetch(`${apiUrl}users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error("Failed to Reister:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Register successful");

      setToken(data.access, data.refresh);
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
    redirect("/");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <form action={handleLogin} className="flex flex-col gap-4 ">
          <h1 className="text-4xl font-bold">Register</h1>
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
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
