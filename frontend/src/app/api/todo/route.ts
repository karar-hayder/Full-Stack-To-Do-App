import { editTodo, getTodos, deleteTodo, createTodo } from "@/lib/todos";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const pageNumber = Number(req.nextUrl.searchParams.get("page")) || 1;
  const data = await getTodos(pageNumber);
  if (!data || typeof data === "number") {
    return NextResponse.json(
      { message: "Error fetching todos" },
      { status: typeof data === "number" ? data : 404 }
    );
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description } = body;
  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 404 }
    );
  }
  const response = await createTodo(title, description);
  if (!response) {
    return NextResponse.json({ message: "Unautherized" }, { status: 401 });
  }
  return NextResponse.json({ message: "Done" }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, completed } = body;
  if (!id || completed == Boolean) {
    return NextResponse.json(
      { message: "Error fetching todos" },
      { status: 404 }
    );
  }

  const response = await editTodo(id, title, description, completed);
  if (!response) {
    return NextResponse.json({ message: "Unautherized" }, { status: 401 });
  }

  return NextResponse.json(
    { message: response.statusText },
    { status: response.status }
  );
}
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json(
      { message: "Error fetching todos" },
      { status: 404 }
    );
  }
  const response = await deleteTodo(id);
  if (!response) {
    return NextResponse.json({ message: "Unautherized" }, { status: 401 });
  }
  return NextResponse.json({ message: "Done" }, { status: 200 });
}
