
import { Container } from 'inversify';
import { ITodoUsecase, TodoUsecase } from '@/core/usecases/TodoUsecase';
import { ITodoRepository, TodoRepository } from '@/core/repository/TodoRepository';
import { ITodoDatasource, TodoDatasource } from '@/core/datasource/TodoDatasource';
import { AxiosInstance, IAxiosInstance } from '@/config/axios';

const container = new Container();
container.bind<IAxiosInstance>('IAxiosInstance').to(AxiosInstance);
container.bind<ITodoUsecase>('ITodoUsecase').to(TodoUsecase);
container.bind<ITodoRepository>('ITodoRepository').to(TodoRepository);
container.bind<ITodoDatasource>('ITodoDatasource').to(TodoDatasource);
export default container;

export const registerInjections = () => {

};


