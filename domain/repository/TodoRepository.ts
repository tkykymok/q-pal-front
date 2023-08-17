import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import type { ITodoDataSource } from '@/domain/datasource/TodoDataSource';
import AddTodo = TodoRequest.AddTodo;
import GetAllTodo = TodoResponse.GetAllTodo;

export interface ITodoRepository {
  getAllTodos(): Promise<GetAllTodo>;

  addTodo(todo: AddTodo): Promise<unknown>;
}

@injectable()
export class TodoRepository implements ITodoRepository {
  constructor(@inject('ITodoDataSource') private datasource: ITodoDataSource) {}

  async getAllTodos(): Promise<GetAllTodo> {
    return this.datasource.getAllTodos();
  }

  async addTodo(todo: AddTodo): Promise<unknown> {
    return this.datasource.addTodo(todo);
  }
}
