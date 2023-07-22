import { Container } from 'inversify';
import { ITodoUsecase, TodoUsecase } from '@/core/usecases/TodoUsecase';
import {
  ITodoRepository,
  TodoRepository,
} from '@/core/repository/TodoRepository';
import {
  ITodoDataSource,
  TodoDataSource,
} from '@/core/datasource/TodoDataSource';
import { AxiosInstance, IAxiosInstance } from '@/config/axios';
import {
  IReservationUsecase,
  ReservationUsecase,
} from '@/core/usecases/ReservationUsecase';
import {
  IReservationRepository,
  ReservationRepository,
} from '@/core/repository/ReservationRepository';
import {
  IReservationDataSource,
  ReservationDataSource,
} from '@/core/datasource/ReservationDataSource';

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
container
  .bind<IReservationDataSource>('IReservationDataSource')
  .to(ReservationDataSource);

export default container;
