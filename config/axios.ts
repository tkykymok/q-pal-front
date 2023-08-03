import axios, { AxiosInstance as Axios } from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';

export interface IAxiosInstance {
  instance: Axios;
}

@injectable()
export class AxiosInstance implements IAxiosInstance {
  instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {'X-Custom-Header': 'foobar'}
  });

  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // リクエストインターセプターを設定します。
    this.instance.interceptors.request.use((config) => {
      // JWTを取得します。この部分は、実際のJWTの取得方法に合わせて修正してください。
      // const token = localStorage.getItem('jwt');
      const token = "testjwttoken"

      if (token) {
        // JWTが存在する場合、Authorizationヘッダーに設定します。
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }
}
