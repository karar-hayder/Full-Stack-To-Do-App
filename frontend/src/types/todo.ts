interface TodosListProps {
  token: string;
  api: string;
}

// Define the Todo type (adjust based on your actual response structure)
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoFromProps {
  token: string;
  api: string;
}

interface TodoEditProps {
  token: string;
  api: string;
  todo: Todo;
}

export type { TodosListProps, Todo, TodoFromProps, TodoEditProps };
