import { backendRegister, getToken } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;
  if (username && password) {
    await backendRegister(username, password);
    const tokens = await getToken();
    if (tokens) {
      return NextResponse.json(tokens);
    } else {
      return NextResponse.json(
        { message: "Error Registering!" },
        { status: 404 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Error Registering!" },
      { status: 404 }
    );
  }
}
