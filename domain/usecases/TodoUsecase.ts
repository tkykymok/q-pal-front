import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import type { ITodoRepository } from '@/domain/repository/TodoRepository';
import AddTodo = TodoRequest.AddTodo;
import GetAllTodo = TodoResponse.GetAllTodo;

// interfaces/ITodoService.ts
export interface ITodoUsecase {
  getAllTodos(): Promise<GetAllTodo>;

  addTodo(todo: AddTodo): Promise<unknown>;
}

@injectable()
export class TodoUsecase implements ITodoUsecase {
  constructor(@inject('ITodoRepository') private repository: ITodoRepository) {}

  getAllTodos(): Promise<GetAllTodo> {
    return this.repository.getAllTodos();
  }

  async addTodo(todo: AddTodo): Promise<unknown> {
    return this.repository.addTodo(todo);
  }
}
