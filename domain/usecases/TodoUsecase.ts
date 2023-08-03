import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import type { ITodoRepository } from '@/domain/repository/TodoRepository';
import AddTodo = TodoRequest.AddTodo;
import BaseResponse = CommonResponse.BaseResponse;
import GetAllTodo = TodoResponse.GetAllTodo;

// interfaces/ITodoService.ts
export interface ITodoUsecase {
  getAllTodos(): Promise<GetAllTodo>;

  addTodo(todo: AddTodo): Promise<BaseResponse>;
}

@injectable()
export class TodoUsecase implements ITodoUsecase {
  constructor(@inject('ITodoRepository') private repository: ITodoRepository) {}

  getAllTodos(): Promise<GetAllTodo> {
    return this.repository.getAllTodos();
  }

  async addTodo(todo: AddTodo): Promise<BaseResponse> {
    return this.repository.addTodo(todo);
  }
}
