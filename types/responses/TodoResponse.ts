namespace TodoResponse {
  export type GetTodo = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  };

  export type GetAllTodo = {
    todos: GetTodo[];
  };
}
