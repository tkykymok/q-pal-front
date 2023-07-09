import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import type { ITodoDatasource } from '@/core/datasource/TodoDatasource';
import BaseResponse = CommonResponse.BaseResponse;
import AddTodo = TodoRequest.AddTodo;
import GetAllTodo = TodoResponse.GetAllTodo;

export interface ITodoRepository {
  getAllTodos(): Promise<GetAllTodo>;

  addTodo(todo: AddTodo): Promise<BaseResponse>;
}

@injectable()
export class TodoRepository implements ITodoRepository {
  constructor(@inject('ITodoDatasource') private datasource: ITodoDatasource) {}

  async getAllTodos(): Promise<GetAllTodo> {
    return this.datasource.getAllTodos();
  }

  async addTodo(todo: AddTodo): Promise<BaseResponse> {
    return this.datasource.addTodo(todo);
  }
}

