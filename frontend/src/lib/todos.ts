import { getToken } from "./auth";

const api = process.env.DJANGO_PUBLIC_API_URL;

export const getTodos = async (pageNumber: number = 1) => {
  const token = await getToken();
  if (!token) {
    return false;
  }
  const response = await fetch(
    `${api}core/todos/?page=${pageNumber}&filter_by=completed&filter_by=-created_at`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!response.ok) {
    return response.status;
  }
  const data = await response.json();
  return data;
};

export const editTodo = async (
  id: number,
  title: string,
  description: string,
  complete: boolean
) => {
  const token = await getToken();
  if (!token) {
    return false;
  }
  const response = await fetch(`${api}core/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      title: title,
      description: description,
      completed: complete,
    }),
  });
  return response;
};

export const deleteTodo = async (id: number) => {
  const token = await getToken();
  if (!token) {
    return false;
  }
  const response = await fetch(`${api}core/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  });
  return response;
};

export const createTodo = async (title: string, description: string) => {
  const token = await getToken();
  if (!token) {
    return false;
  }
  const response = await fetch(`${api}core/todos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });
  if (!(response.status == 201)) {
    return response.status;
  } else {
    return true;
  }
};
