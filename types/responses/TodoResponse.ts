namespace TodoResponse {
  export type Todo = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  };

  export type GetAllTodo = {
    todos: Todo[];
  };
}
