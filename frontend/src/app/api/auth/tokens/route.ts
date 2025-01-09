import { NextResponse } from "next/server";
import { refreshAccessToken, getToken, removeToken } from "@/lib/auth";

// GET request to fetch current tokens
export async function GET() {
  try {
    const tokenData = await getToken(); // Call the getToken function to fetch token data

    if (tokenData) {
      return NextResponse.json(tokenData); // Send back the tokens
    } else {
      return NextResponse.json({ message: "No tokens found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { message: "Error fetching tokens" },
      { status: 500 }
    );
  }
}

// POST request to refresh the access token
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const refreshToken = body.refresh;

    // Ensure refreshToken is present
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Call refreshAccessToken to attempt refreshing the token
    const refreshedTokens = await refreshAccessToken(refreshToken);

    if (refreshedTokens) {
      const { accessToken, refreshToken } = (await getToken()) || {};

      return NextResponse.json({ accessToken, refreshToken });
    } else {
      return NextResponse.json(
        { message: "Failed to refresh token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { message: "Error refreshing token" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  console.log("Got api");
  if (await removeToken()) {
    return NextResponse.json({ message: "Done Logout" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Failed to logout" }, { status: 404 });
  }
}
