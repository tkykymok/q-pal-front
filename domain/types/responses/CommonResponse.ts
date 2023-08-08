namespace CommonResponse {
  export type ApiResponse<T> = {
    data?: T
    messages: string[];
  };
}
