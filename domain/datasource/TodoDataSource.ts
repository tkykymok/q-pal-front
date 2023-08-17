import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import AddTodo = TodoRequest.AddTodo;
import GetAllTodo = TodoResponse.GetAllTodo;
import { AxiosInstance } from '@/config/axios';

export interface ITodoDataSource {
  getAllTodos(): Promise<GetAllTodo>;

  addTodo(todo: AddTodo): Promise<unknown>;
}

@injectable()
export class TodoDataSource implements ITodoDataSource {
  constructor(@inject('IAxiosInstance') private axiosInstance: AxiosInstance) {}

  async getAllTodos(): Promise<GetAllTodo> {
    const response = await this.axiosInstance.instance('/todos');
    return response.data;
  }

  async addTodo(todo: AddTodo): Promise<unknown> {
    const response = await this.axiosInstance.instance.post('/todo', todo);
    return response.data;
  }
}
