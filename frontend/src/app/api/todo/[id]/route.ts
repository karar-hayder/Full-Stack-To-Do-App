import { getSingleTodo } from "@/lib/todos";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const todoid = parseInt(id, 10);
  console.log(todoid);

  try {
    const data = await getSingleTodo(todoid);

    if (!data) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { message: "Error fetching todo" },
      { status: 500 }
    );
  }
}
