export namespace Message {
  export const SUCCESS = 'Success';
  export const WARNING = 'Warning';
  export const ERROR = 'Error';

  export type MessageType = typeof SUCCESS | typeof WARNING | typeof ERROR;
}
