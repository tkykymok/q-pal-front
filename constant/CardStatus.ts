export namespace CardStatus {
  export const IN_PROGRESS = 'InProgress';
  export const WAITING = 'Waiting';
  export const PENDING = 'Pending';
  export const DONE = 'Done';
  export const CANCELED = 'Canceled';

  export type Status =
    | typeof IN_PROGRESS
    | typeof WAITING
    | typeof PENDING
    | typeof DONE
    | typeof CANCELED;

  const statusMapping = new Map<Status, { status: string; title: string }>([
    [IN_PROGRESS, { status: IN_PROGRESS, title: '案内中' }],
    [WAITING, { status: WAITING, title: '案内待ち' }],
    [PENDING, { status: PENDING, title: '保留' }],
    [DONE, { status: DONE, title: '案内済み' }],
    [CANCELED, { status: CANCELED, title: 'キャンセル' }],
  ]);

  export const getCardStatusTitle = (status: Status): string => {
    return statusMapping.get(status)?.title ?? '';
  };
}
