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
import {IStaffUsecase, StaffUsecase} from '@/domain/usecases/StaffUsecase';
import {IStaffRepository, StaffRepository} from '@/domain/repository/StaffRepository';

const container = new Container();
container.bind<IAxiosInstance>('IAxiosInstance').to(AxiosInstance);

container.bind<ITodoUsecase>('ITodoUsecase').to(TodoUsecase);
container.bind<ITodoRepository>('ITodoRepository').to(TodoRepository);
container.bind<ITodoDataSource>('ITodoDataSource').to(TodoDataSource);

// Reservation
container
  .bind<IReservationUsecase>('IReservationUsecase')
  .to(ReservationUsecase);
container
  .bind<IReservationRepository>('IReservationRepository')
  .to(ReservationRepository);

// Staff
container
  .bind<IStaffUsecase>('IStaffUsecase')
  .to(StaffUsecase);
container
  .bind<IStaffRepository>('IStaffRepository')
  .to(StaffRepository);

export default container;
