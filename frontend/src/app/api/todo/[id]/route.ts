import { getSingleTodo } from "@/lib/todos";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const todoid = parseInt(params.id, 10); // Convert the string to a number if needed.
  console.log(todoid);

  const data = await getSingleTodo(todoid);

  if (!data || typeof data === "number") {
    return NextResponse.json(
      { message: "Error fetching todos" },
      { status: typeof data === "number" ? data : 404 }
    );
  }

  return NextResponse.json(data);
}
