namespace TodoResponse {

  export interface GetTodo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  }

  export interface GetAllTodo {
    todos: GetTodo[];
  }
}
