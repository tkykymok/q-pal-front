import axios, { AxiosInstance as Axios } from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';

export interface IAxiosInstance {
  instance: Axios;
}

@injectable()
export class AxiosInstance implements IAxiosInstance {
  instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });
}
