import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Function to set the tokens in cookies
export const setToken = async (accessToken: string, refreshToken: string) => {
  "use server"; // Make sure this is only in server-side code
  const cookiesStorage = await cookies();

  if (!cookiesStorage) {
    return;
  }

  // Set access token (expires in 30 minutes)
  cookiesStorage.set("access-token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes expiration
  });

  // Set refresh token (expires in 1 day)
  cookiesStorage.set("refresh-token", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day expiration
  });

  return true;
};

// Function to remove the tokens from cookies
export const removeToken = () => {
  const response = NextResponse.next();
  response.cookies.delete("access-token");
  response.cookies.delete("refresh-token");
  return response;
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = async (
  refreshToken: string
): Promise<boolean> => {
  "use server"; // This should be used in server-side code

  const apiUrl = process.env.DJANGO_PUBLIC_API_URL || ""; // URL for your backend

  try {
    const response = await fetch(`${apiUrl}/users/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }), // Sending the refresh token
    });

    if (response.ok) {
      const data = await response.json();
      const cookiesStorage = await cookies();
      cookiesStorage.set("access-token", data.access, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 4), // 30 minutes expiration
      }); // Set the new tokens in cookies
      return true;
    } else {
      removeToken(); // Remove tokens if refresh fails
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    removeToken(); // Remove tokens if there's an error
    return false;
  }
};

// Function to retrieve the tokens from cookies, or refresh if expired/invalid
export const getToken = async () => {
  "use server"; // This should be used in server-side code

  const cookiesStorage = await cookies();
  const accessToken = cookiesStorage.get("access-token")?.value || "";
  const refreshToken = cookiesStorage.get("refresh-token")?.value || "";

  if (!accessToken && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (!refreshed) {
      return false; // If token refresh fails, return false
    }
  } else if (!accessToken) {
    return false; // If there's no access token, return false
  }

  return { accessToken, refreshToken };
};

// Check if user is authenticated by verifying the token's existence
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token; // If there's a valid token, return true; else false
};

export const backendLogin = async (username: string, password: string) => {
  "use server";
  if (!username || !password) {
    console.error("Username and password are required.");
    return false;
  }

  try {
    const apiUrl = process.env.DJANGO_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("API URL is not defined in the environment variables.");
      return;
    }
    const response = await fetch(`${apiUrl}users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      console.error("Failed to login:", response.statusText);
      return;
    }

    const data = await response.json();
    console.log("Login successful");
    setToken(data.access, data.refresh);
  } catch (error) {
    console.error("An error occurred while logging in:", error);
  }
};
