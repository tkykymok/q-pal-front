import axios, {
  AxiosError,
  AxiosInstance as Axios,
  HttpStatusCode,
} from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';
import messageStore from '@/store/MessageStore';
import ErrorResponse = CommonResponse.ErrorResponse;
import { Message } from '@/constant/MessageType';
import ERROR = Message.ERROR;

export interface IAxiosInstance {
  instance: Axios;
}

@injectable()
export class AxiosInstance implements IAxiosInstance {
  instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
  });

  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // リクエストインターセプターを設定します。
    this.instance.interceptors.request.use(
      (config) => {
        const token = 'testjwttoken';
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // タイマーID
    let timerId: NodeJS.Timeout | null = null;

    // レスポンスインターセプターを設定します。
    this.instance.interceptors.response.use(
      (response) => {
        // console.log('Received response:', response);
        return response;
      },
      (error: AxiosError) => {
        const statusCode = error.response?.status;
        const response: ErrorResponse = error.response?.data as ErrorResponse;
        const messages = response.messages;
        // 既存のタイマーがあればキャンセル
        if (timerId) {
          clearTimeout(timerId);
        }

        switch (statusCode) {
          case HttpStatusCode.BadRequest:
            messageStore.setState({ type: ERROR });
            messageStore.setState({ messages: messages });
            // 5秒後にメッセージを削除するタイマーを設定し、そのIDを保持
            timerId = setTimeout(() => {
              messageStore.setState({ type: null });
              messageStore.setState({ messages: [] });
            }, 5000);
            break;
          default:
        }

        return Promise.reject(error);
      }
    );
  }
}
