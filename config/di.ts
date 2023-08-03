import { Container } from 'inversify';
import { ITodoUsecase, TodoUsecase } from '@/domain/usecases/TodoUsecase';
import {
  ITodoRepository,
  TodoRepository,
} from '@/domain/repository/TodoRepository';
import {
  ITodoDataSource,
  TodoDataSource,
} from '@/domain/datasource/TodoDataSource';
import { AxiosInstance, IAxiosInstance } from '@/config/axios';
import {
  IReservationUsecase,
  ReservationUsecase,
} from '@/domain/usecases/ReservationUsecase';
import {
  IReservationRepository,
  ReservationRepository,
} from '@/domain/repository/ReservationRepository';

const container = new Container();
container.bind<IAxiosInstance>('IAxiosInstance').to(AxiosInstance);

container.bind<ITodoUsecase>('ITodoUsecase').to(TodoUsecase);
container.bind<ITodoRepository>('ITodoRepository').to(TodoRepository);
container.bind<ITodoDataSource>('ITodoDataSource').to(TodoDataSource);

container
  .bind<IReservationUsecase>('IReservationUsecase')
  .to(ReservationUsecase);
container
  .bind<IReservationRepository>('IReservationRepository')
  .to(ReservationRepository);

export default container;
