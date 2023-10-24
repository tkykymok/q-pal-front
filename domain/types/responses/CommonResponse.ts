namespace CommonResponse {
  export type ApiResponse<T> = {
    data?: T;
    messages: string[];
  };

  export type ErrorResponse = {
    error: string;
    messages: string[];
  };
}
