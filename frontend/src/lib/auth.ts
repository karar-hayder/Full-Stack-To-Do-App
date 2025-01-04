import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const setToken = (accessToken: string, refreshToken: string) => {
  const response = NextResponse.next();
  response.cookies.set("access-token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 30),
  });
  response.cookies.set("refresh-token", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
  });
  return response;
};

export const removeToken = () => {
  const response = NextResponse.next();
  response.cookies.delete("access-token");
  response.cookies.delete("refresh-token");
  return response;
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const cookiesStorage = await cookies();
  const refreshToken = cookiesStorage.get("refresh-token")?.value || "";
  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || "";

  try {
    const response = await fetch(`${apiUrl}auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access, data.refresh);
      return true;
    } else {
      removeToken();
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    removeToken();
    return false;
  }
};

export const getToken = async () => {
  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("access-token")?.value || "";
  const refreshToken = cookiesStorage.get("refresh-token")?.value || "";

  if (!accessToken && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      return false;
    }
  } else if (!accessToken) {
    return false;
  }

  return { accessToken, refreshToken };
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};
